import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { createHmac } from 'crypto';
import { InitializePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly baseUrl: string;
  private readonly secretKey: string;
  private readonly webhookSecret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('BUDPAY_BASEURL');
    this.secretKey = this.configService.get<string>('BUDPAY_SECRETKEY');
    this.webhookSecret = this.configService.get<string>(
      'BUDPAY_WEBHOOK_SECRET',
    );

    if (!this.secretKey || !this.webhookSecret) {
      throw new BadRequestException(
        'BUDPAY_SECRETKEY or BUDPAY_WEBHOOK_SECRET is not defined in the configuration',
      );
    }
  }

  async initializePayment(
    InitializePaymentDto: InitializePaymentDto,
  ): Promise<any> {
    try {
      const url = `${this.baseUrl}/transaction/initialize`;

      const headers = {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      };
      const data = {
        email: InitializePaymentDto.email,
        amount: InitializePaymentDto.amount.toString(),
        callback: `${this.configService.get('CALLBACK_URL')}/payment/callback`,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, data, { headers }),
      );

      this.logger.debug('Payment initialized successfully');
      return response.data;
    } catch (error) {
      console.log(error);
      this.logger.error(
        'Error initializing payment:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('Error initializing payment');
    }
  }

  async verifyTransaction(reference: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/transaction/verify/${reference}`;
      const headers = { Authorization: `Bearer ${this.secretKey}` };

      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );

      this.logger.debug('Transaction verified successfully');
      return response.data;
    } catch (error) {
      this.logger.error(
        'Error verifying transaction:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('Error verifying transaction');
    }
  }

  async handleCallback(payload: any, signature: string): Promise<void> {
    if (!this.verifyWebhookSignature(payload, signature)) {
      throw new BadRequestException('Invalid webhook signature');
    }

    // Process the webhook payload
    const { reference } = payload;
    const verificationResult = await this.verifyTransaction(reference);

    if (verificationResult.status === 'success') {
      // Payment was successful, update your database or perform any other necessary actions
      this.logger.debug(`Payment for reference ${reference} was successful`);
      // Implement your logic here (e.g., update order status, send confirmation email, etc.)
    } else {
      this.logger.warn(
        `Payment for reference ${reference} failed or is pending`,
      );
      // Handle failed or pending payments
    }
  }

  private verifyWebhookSignature(payload: any, signature: string): boolean {
    const hmac = createHmac('sha512', this.webhookSecret);
    const expectedSignature = hmac
      .update(JSON.stringify(payload))
      .digest('hex');
    return expectedSignature === signature;
  }
}
