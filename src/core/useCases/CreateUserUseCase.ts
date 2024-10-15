import { Inject, Injectable } from "@nestjs/common";
import { ConflictException } from '@nestjs/common';
import { Usuario } from "../entities/Usuario";
import { CreateUserDto } from "../dto/CreateUserDto";
import { EquipoIoT } from "../entities/EquipoIoT";
import { IUsuarioRepository } from "../data/IUsuarioRepository";

@Injectable()
export class CreateUserUseCase {
  constructor( @Inject("IUsuarioRepository") private  readonly   usuarioRepository: IUsuarioRepository) {}

  async execute(createUserDto: CreateUserDto): Promise<Usuario> {
    const existingUser = await this.usuarioRepository.findByEmail(createUserDto.correo);
    if (existingUser) {
      throw new ConflictException('El usuario con este correo ya existe.');
    }
    if (existingUser) {
      throw new ConflictException('El usuario con este correo ya existe.');
    }

    const usuario = new Usuario();
    usuario.nombre = createUserDto.nombre;
    usuario.correo = createUserDto.correo;
    usuario.telefono = createUserDto.telefono;
    usuario.equipoIoT =new EquipoIoT();
    usuario.equipoIoT.numero_serie=createUserDto.codigo_equipo_iot;
    usuario.equipoIoT.modelo="1.0.0";

    return await this.usuarioRepository.create(usuario);
  }
}