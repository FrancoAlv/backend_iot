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
  async findByUid(uid_codigo:string): Promise<Usuario> {
    return await this.usuarioRepository.findByUid(uid_codigo);
  }
  async findByIdWithAll(usuarioId:number,accidente_id:number): Promise<Usuario> {
    return await this.usuarioRepository.findByIdwithall(usuarioId,accidente_id);
  }

  async findByUidWithAll(uid_codigo:string,accidente_id:number): Promise<Usuario |null>{
    return  this.usuarioRepository.findByUidWithAll(uid_codigo,accidente_id);
  }

  async create(usuario: Usuario): Promise<Usuario> {
    return await this.usuarioRepository.create(usuario);
  }

  async findByEmail(correo: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findByEmail(correo);
  }

  async findByEmailAndUID(correo: string,UID:string): Promise<Usuario | null> {
    return await this.usuarioRepository.findByEmailAndUID(correo,UID);
  }

async  findByUidandemailwithall(uid: string,email:string)  :Promise<Usuario | null>{
  return await this.usuarioRepository.findByUidandemailwithall(uid,email);
}
  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.findAll();
  }

  putUsuario(usuario: Usuario): Promise<Usuario> {
    return  this.usuarioRepository.putUsuario(usuario);
  }
}