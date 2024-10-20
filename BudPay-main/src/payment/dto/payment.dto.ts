import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InitializePaymentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export interface InitializePayment {
  status: string;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}
