import { Controller, Post, Body, Param, Get, Patch, Delete } from '@nestjs/common';
import { PoliciaDto } from '../core/dto/PoliciaDto';
import { PoliciaUseCase } from "../core/useCases/PoliciaUseCase";
import { Policia } from "../core/entities/Policia";
import { PoliciaCercanaDto } from "../core/dto/PoliciaCercanaDto";

@Controller('usuario')
export class PoliciaController {
  constructor(private readonly policiaUseCase: PoliciaUseCase) {}

  @Post(':uid_codigo/policia/agregar')
  async agregarPolicia(@Param('uid_codigo') uid_codigo: string, @Body() policiaDto: PoliciaDto): Promise<{ message: string }> {
    await this.policiaUseCase.add(uid_codigo, policiaDto);
    return { message: 'Policía agregado exitosamente' };
  }

  @Get(':uid_codigo/policia')
  async obtenerPolicias(@Param('uid_codigo') uid_codigo: string): Promise<Policia[]> {
    return await this.policiaUseCase.getAll(uid_codigo);
  }
  @Post(':uid_codigo/policia/buscar-cercanos')
  async buscarPoliciasCercanos(
    @Param('uid_codigo') uid_codigo: string,
    @Body() policiaCercanaDto: PoliciaCercanaDto
  ): Promise<{ message: string }> {
    await this.policiaUseCase.findNearbyPolicias(
      uid_codigo,
      policiaCercanaDto.lat,
      policiaCercanaDto.lng,
      policiaCercanaDto.radius
    );
    return { message: 'Policías cercanos registrados exitosamente' };
  }

  @Patch(':uid_codigo/policia/:policiaId')
  async actualizarPolicia(@Param('uid_codigo') uid_codigo: string, @Param('policiaId') policiaId: number, @Body() policiaDto: PoliciaDto): Promise<{ message: string }> {
    await this.policiaUseCase.update(uid_codigo, policiaId, policiaDto);
    return { message: 'Policía actualizado exitosamente' };
  }

  @Delete(':uid_codigo/policia/:policiaId')
  async eliminarPolicia(@Param('uid_codigo') uid_codigo: string, @Param('policiaId') policiaId: number): Promise<{ message: string }> {
    await this.policiaUseCase.delete(uid_codigo, policiaId);
    return { message: 'Policía eliminado exitosamente' };
  }
}