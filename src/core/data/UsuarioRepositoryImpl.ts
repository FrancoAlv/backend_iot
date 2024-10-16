import { IUsuarioRepository } from './IUsuarioRepository';
import { Usuario } from '../entities/Usuario';
import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from '../repositories/UsuarioRepository';

@Injectable()
export class UsuarioRepositoryImpl implements IUsuarioRepository {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async findById(usuarioId:number): Promise<Usuario> {
    return await this.usuarioRepository.findById(usuarioId);
  }
  async findByIdWithAll(usuarioId:number,accidente_id:number): Promise<Usuario> {
    return await this.usuarioRepository.findByIdwithall(usuarioId,accidente_id);
  }

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