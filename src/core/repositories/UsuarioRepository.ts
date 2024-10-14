import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Usuario } from "../entities/Usuario";

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
  ) {}

  async create(usuario: Usuario): Promise<Usuario> {
    return await this.repository.save(usuario);
  }

  async findByEmail(correo: string): Promise<Usuario | null> {
    return await this.repository.findOne({ where: { correo } });
  }

  async findAll(): Promise<Usuario[] | null> {
    return await this.repository.find();
  }
}