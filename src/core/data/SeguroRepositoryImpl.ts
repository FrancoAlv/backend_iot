import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seguro } from '../entities/Seguro';
import { Usuario } from '../entities/Usuario';
import { ISeguroRepository } from "./ISeguroRepository";

@Injectable()
export class SeguroRepositoryImpl implements ISeguroRepository {
  constructor(
    @InjectRepository(Seguro)
    private readonly repository: Repository<Seguro>,
  ) {

  }

  async save(seguro: Seguro): Promise<void> {
    await this.repository.save(seguro);
  }

  async findAllByUsuario(usuario: Usuario): Promise<Seguro[]> {
    return await this.repository.find({ where: {usuarios: usuario } });
  }

  async findByIdAndUsuario(seguroId: number, usuarioId: number): Promise<Seguro | null> {
    return await this.repository.findOne({ where: { seguro_id: seguroId, usuarios: { usuario_id: usuarioId } } });
  }

  async delete(seguro: Seguro): Promise<void> {
    await this.repository.remove(seguro);
  }
}