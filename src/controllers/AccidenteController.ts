import { Controller, Post, Body } from '@nestjs/common';
import { AccidenteDto } from '../core/dto/AccidenteDto';
import { OpenAIAnalysisResult } from '../core/interfaces/OpenAIAnalysisResult';
import { AccidenteUseCase } from "../core/useCases/AccidenteUseCase";

@Controller('accidente')
export class AccidenteController {
  constructor(private readonly accidenteUseCase: AccidenteUseCase) {}

  @Post('registrar')
  async registrarAccidente(@Body() accidenteDto: AccidenteDto): Promise<{ analysis: OpenAIAnalysisResult[] }> {
    return await this.accidenteUseCase.execute(accidenteDto);
  }
}
