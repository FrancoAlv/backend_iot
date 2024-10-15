import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipoIoT } from '../entities/EquipoIoT';
import { EquipoIoTRepository } from "./EquipoIoTRepository";

@Injectable()
export class EquipoIoTRepositoryImpl implements EquipoIoTRepository {
  constructor(
    @InjectRepository(EquipoIoT)
    private readonly repository: Repository<EquipoIoT>,
  ) {

  }

  async findByNumeroSerie(numeroSerie: string): Promise<EquipoIoT | null> {
    return await this.repository.findOne({ where: { numero_serie: numeroSerie }, relations: ['usuario'] });
  }
}
