import { Controller, Post, Body, Param, Get, Patch, Delete } from '@nestjs/common';
import { PoliciaDto } from '../core/dto/PoliciaDto';
import { PoliciaUseCase } from "../core/useCases/PoliciaUseCase";

@Controller('usuario')
export class PoliciaController {
  constructor(private readonly policiaUseCase: PoliciaUseCase) {}

  @Post(':usuarioId/policia/agregar')
  async agregarPolicia(@Param('usuarioId') usuarioId: number, @Body() policiaDto: PoliciaDto): Promise<{ message: string }> {
    await this.policiaUseCase.add(usuarioId, policiaDto);
    return { message: 'Policía agregado exitosamente' };
  }

  @Get(':usuarioId/policia')
  async obtenerPolicias(@Param('usuarioId') usuarioId: number): Promise<PoliciaDto[]> {
    return await this.policiaUseCase.getAll(usuarioId);
  }

  @Patch(':usuarioId/policia/:policiaId')
  async actualizarPolicia(@Param('usuarioId') usuarioId: number, @Param('policiaId') policiaId: number, @Body() policiaDto: PoliciaDto): Promise<{ message: string }> {
    await this.policiaUseCase.update(usuarioId, policiaId, policiaDto);
    return { message: 'Policía actualizado exitosamente' };
  }

  @Delete(':usuarioId/policia/:policiaId')
  async eliminarPolicia(@Param('usuarioId') usuarioId: number, @Param('policiaId') policiaId: number): Promise<{ message: string }> {
    await this.policiaUseCase.delete(usuarioId, policiaId);
    return { message: 'Policía eliminado exitosamente' };
  }
}