import { Module } from "@nestjs/common";
import { CloudinaryService } from "./CloudinaryService";
import { OpenAIService } from "./OpenAIService";

@Module({
  exports :[CloudinaryService,OpenAIService],
  providers : [CloudinaryService,OpenAIService]
})
export class ServicesModule {}