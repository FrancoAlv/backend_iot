import { Inject, Injectable } from "@nestjs/common";
import { Usuario } from "../entities/Usuario";
import { UsuarioRepository } from "../repositories/UsuarioRepository";


@Injectable()
export class UsuarioService {
  constructor( @Inject("IUsuarioRepository")  private readonly usuarioRepository: UsuarioRepository) {}

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.findAll();
  }
}
