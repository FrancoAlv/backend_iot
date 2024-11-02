import { Controller, Post, Body, Param, Get, Patch, Delete, Put } from "@nestjs/common";
import { FamiliarDto } from '../core/dto/FamiliarDto';
import { FamiliarUseCase } from "../core/useCases/FamiliarUseCase";
import { Familiar } from "../core/entities/Familiar";
import { WhatsAppService } from "../services/WhatsAppService";

@Controller('usuario')
export class FamiliarController {
  constructor(private readonly familiarUseCase: FamiliarUseCase) {}

  @Post(':uid_codigo/familiar/agregar')
  async agregarFamiliar(@Param('uid_codigo') uid_codigo: string, @Body() familiarDto: FamiliarDto): Promise<{ message: string;familiar:Familiar }> {
    const data= await this.familiarUseCase.execute(uid_codigo, familiarDto);
    return { message: 'Familiar agregado exitosamente' ,familiar:data };
  }

  @Get(':uid_codigo/familiar')
  async obtenerFamiliares(@Param('uid_codigo') uid_codigo: string): Promise<Familiar[]> {
    return await this.familiarUseCase.getAll(uid_codigo);
  }

  @Put(':uid_codigo/familiar/:familiarId')
  async actualizarFamiliar(@Param('uid_codigo') uid_codigo: string, @Param('familiarId') familiarId: number, @Body() familiarDto: FamiliarDto): Promise<{ message: string }> {
    await this.familiarUseCase.update(uid_codigo, familiarId, familiarDto);
    return { message: 'Familiar actualizado exitosamente' };
  }

  @Delete(':uid_codigo/familiar/:familiarId')
  async eliminarFamiliar(@Param('uid_codigo') uid_codigo: string, @Param('familiarId') familiarId: number): Promise<{ message: string }> {
    await this.familiarUseCase.delete(uid_codigo, familiarId);
    return { message: 'Familiar eliminado exitosamente' };
  }
}