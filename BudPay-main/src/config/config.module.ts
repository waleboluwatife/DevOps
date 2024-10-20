import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        PORT: Joi.string().required(),
        BUDPAY_BASEURL: Joi.string().required(),
        BUDPAY_SECRETKEY: Joi.string().required(),
        CALLBACK_URL: Joi.string().required(),
        BUDPAY_WEBHOOK_SECRET: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('production', 'development', 'test')
          .default('development'),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
