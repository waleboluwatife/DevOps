import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitializePayment, InitializePaymentDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('initialize')
  public async Subscription(
    @Body() InitializePaymentDto: InitializePaymentDto,
  ): Promise<InitializePayment> {
    return await this.paymentService.initializePayment(InitializePaymentDto);
  }
}
