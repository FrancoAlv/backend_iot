import { Module } from "@nestjs/common";
import { CloudinaryService } from "./CloudinaryService";
import { OpenAIService } from "./OpenAIService";
import { WhatsAppService } from "./WhatsAppService";

@Module({
  exports :[CloudinaryService,OpenAIService,WhatsAppService],
  providers : [CloudinaryService,OpenAIService,WhatsAppService]
})
export class ServicesModule {}