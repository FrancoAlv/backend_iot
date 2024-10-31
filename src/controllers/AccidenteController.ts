import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import { AccidenteDto } from '../core/dto/AccidenteDto';
import { OpenAIAnalysisResult } from '../core/interfaces/OpenAIAnalysisResult';
import { AccidenteUseCase } from "../core/useCases/AccidenteUseCase";
import { Usuario } from "../core/entities/Usuario";
import { Accidente } from "../core/entities/Accidente";

@Controller('accidente')
export class AccidenteController {
  constructor(private readonly accidenteUseCase: AccidenteUseCase) {}

  @Post('registrar')
  async registrarAccidente(@Body() accidenteDto: AccidenteDto): Promise<{ analysis: OpenAIAnalysisResult[] }> {
    return await this.accidenteUseCase.execute(accidenteDto);
  }

  @Get('findaccidente')
  async findallAccidentes(@Query("uid_user") uid_user:string ,@Query("email") email:string): Promise<Accidente[]> {
    return await this.accidenteUseCase.findByUidandemailwithall(uid_user,email);
  }


}
