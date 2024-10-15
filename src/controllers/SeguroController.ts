import { Controller, Post, Body, Param, Get, Patch, Delete } from '@nestjs/common';

import { SeguroDto } from '../core/dto/SeguroDto';
import { SeguroUseCase } from "../core/useCases/SeguroUseCase";

@Controller('usuario')
export class SeguroController {
  constructor(private readonly seguroUseCase: SeguroUseCase) {}

  @Post(':usuarioId/seguro/agregar')
  async agregarSeguro(@Param('usuarioId') usuarioId: number, @Body() seguroDto: SeguroDto): Promise<{ message: string }> {
    await this.seguroUseCase.add(usuarioId, seguroDto);
    return { message: 'Seguro agregado exitosamente' };
  }

  @Get(':usuarioId/seguro')
  async obtenerSeguros(@Param('usuarioId') usuarioId: number): Promise<SeguroDto[]> {
    return await this.seguroUseCase.getAll(usuarioId);
  }

  @Patch(':usuarioId/seguro/:seguroId')
  async actualizarSeguro(@Param('usuarioId') usuarioId: number, @Param('seguroId') seguroId: number, @Body() seguroDto: SeguroDto): Promise<{ message: string }> {
    await this.seguroUseCase.update(usuarioId, seguroId, seguroDto);
    return { message: 'Seguro actualizado exitosamente' };
  }

  @Delete(':usuarioId/seguro/:seguroId')
  async eliminarSeguro(@Param('usuarioId') usuarioId: number, @Param('seguroId') seguroId: number): Promise<{ message: string }> {
    await this.seguroUseCase.delete(usuarioId, seguroId);
    return { message: 'Seguro eliminado exitosamente' };
  }
}