import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Familiar } from '../entities/Familiar';
import { IFamiliarRepository } from "./IFamiliarRepository";
import { Usuario } from "../entities/Usuario";

@Injectable()
export class FamiliarRepositoryImpl implements IFamiliarRepository {
  constructor(
    @InjectRepository(Familiar)
    private readonly repository: Repository<Familiar>,
  ) {

  }

  async save(familiar: Familiar): Promise<Familiar> {
    return  await this.repository.save(familiar);
  }

  async findAllByUsuario(usuario: Usuario): Promise<Familiar[]> {
    return await this.repository.find({ where: { usuario } });
  }

  async findByIdAndUsuario(familiarId: number, usuarioId: number): Promise<Familiar | null> {
    return await this.repository.findOne({ where: { familiar_id: familiarId, usuario: { usuario_id: usuarioId } } });
  }

  async delete(familiar: Familiar): Promise<void> {
    await this.repository.remove(familiar);
  }
}