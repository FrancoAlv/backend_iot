import { IUsuarioRepository } from './IUsuarioRepository';
import { Usuario } from '../entities/Usuario';
import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from '../repositories/UsuarioRepository';

@Injectable()
export class UsuarioRepositoryImpl implements IUsuarioRepository {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async create(usuario: Usuario): Promise<Usuario> {
    return await this.usuarioRepository.create(usuario);
  }

  async findByEmail(correo: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findByEmail(correo);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.findAll();
  }
}