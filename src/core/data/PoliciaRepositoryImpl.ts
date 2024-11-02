import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policia } from '../entities/Policia';
import { Usuario } from '../entities/Usuario';
import { IPoliciaRepository } from "./IPoliciaRepository";

@Injectable()
export class PoliciaRepositoryImpl implements IPoliciaRepository {
  constructor(
    @InjectRepository(Policia)
    private readonly repository: Repository<Policia>,
  ) {

  }

  async save(policia: Policia): Promise<void> {
    await this.repository.save(policia);
  }

  async findAllByUsuario(usuario: Usuario): Promise<Policia[]> {
    return await this.repository.find({ where: { usuario } });
  }

  async findByIdAndUsuario(policiaId: number, uid_codigo: string): Promise<Policia | null> {
    return await this.repository.findOne({ where: { policia_id: policiaId, usuario: { uid_codigo: uid_codigo } } });
  }

  async delete(policia: Policia): Promise<void> {
    await this.repository.remove(policia);
  }
}