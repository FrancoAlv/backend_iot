import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WhatsAppService {
  private client;

  constructor(configService: ConfigService) {
    const accountSid = configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = configService.get<string>('TWILIO_AUTH_TOKEN');
    this.client = Twilio(accountSid, authToken);
  }

  async sendWhatsAppMessage(to: string, message: string): Promise<void> {
    await this.client.messages.create({
      from: 'whatsapp:+14155238886', // Número proporcionado por Twilio
      to: `whatsapp:+51${to}`,
      body: message,
    });
  }
}