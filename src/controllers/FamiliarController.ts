import { Controller, Post, Body, Param, Get, Patch, Delete } from "@nestjs/common";
import { FamiliarDto } from '../core/dto/FamiliarDto';
import { FamiliarUseCase } from "../core/useCases/FamiliarUseCase";
import { Familiar } from "../core/entities/Familiar";

@Controller('usuario')
export class FamiliarController {
  constructor(private readonly familiarUseCase: FamiliarUseCase) {}

  @Post(':usuarioId/familiar/agregar')
  async agregarFamiliar(@Param('usuarioId') usuarioId: number, @Body() familiarDto: FamiliarDto): Promise<{ message: string;familiar:Familiar }> {
    const data= await this.familiarUseCase.execute(usuarioId, familiarDto);
    return { message: 'Familiar agregado exitosamente' ,familiar:data };
  }

  @Get(':usuarioId/familiar')
  async obtenerFamiliares(@Param('usuarioId') usuarioId: number): Promise<FamiliarDto[]> {
    return await this.familiarUseCase.getAll(usuarioId);
  }

  @Patch(':usuarioId/familiar/:familiarId')
  async actualizarFamiliar(@Param('usuarioId') usuarioId: number, @Param('familiarId') familiarId: number, @Body() familiarDto: FamiliarDto): Promise<{ message: string }> {
    await this.familiarUseCase.update(usuarioId, familiarId, familiarDto);
    return { message: 'Familiar actualizado exitosamente' };
  }

  @Delete(':usuarioId/familiar/:familiarId')
  async eliminarFamiliar(@Param('usuarioId') usuarioId: number, @Param('familiarId') familiarId: number): Promise<{ message: string }> {
    await this.familiarUseCase.delete(usuarioId, familiarId);
    return { message: 'Familiar eliminado exitosamente' };
  }
}