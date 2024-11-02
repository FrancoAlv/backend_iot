import { Inject, Injectable } from "@nestjs/common";
import { ConflictException } from '@nestjs/common';
import { Usuario } from "../entities/Usuario";
import { CreateUserDto } from "../dto/CreateUserDto";
import { EquipoIoT } from "../entities/EquipoIoT";
import { IUsuarioRepository } from "../data/IUsuarioRepository";
import { EquipoIoTRepository } from "../data/EquipoIoTRepository";
import { UsuarioUidDto } from "../dto/UsuarioUidDto";
import { PutUserDto } from "../dto/PutUserDto";

@Injectable()
export class CreateUserUseCase {
  constructor( @Inject("IUsuarioRepository") private readonly usuarioRepository:IUsuarioRepository,
               @Inject("IEquipoIoTRepository") private readonly equipoIoTRepository:EquipoIoTRepository,) {}

  async execute(createUserDto: CreateUserDto): Promise<Usuario> {
    const existingUser = await this.usuarioRepository.findByEmail(createUserDto.correo);

    if (existingUser) {
      throw new ConflictException('El usuario con este correo ya existe.');
    }

    const equipo = await this.equipoIoTRepository.findByNumeroSerie(createUserDto.codigo_equipo_iot);

    if (equipo) {
      throw new ConflictException('El Numero de serie ya fue registrado ');
    }

    const usuario = new Usuario();
    usuario.nombre = createUserDto.nombre;
    usuario.correo = createUserDto.correo;
    usuario.telefono = createUserDto.telefono;
    usuario.uid_codigo=createUserDto.uid_codigo;
    usuario.apellido_firts=createUserDto.apellido_firts;
    usuario.apellido_second =createUserDto.apellido_second;
    usuario.equipoIoT =new EquipoIoT();
    usuario.equipoIoT.numero_serie=createUserDto.codigo_equipo_iot;
    usuario.equipoIoT.modelo="1.0.0";

    return await this.usuarioRepository.create(usuario);
  }


  async findUserbycorreoandUI(usuarioUidDto:UsuarioUidDto){
    const existingUser = await this.usuarioRepository.findByEmailAndUID(usuarioUidDto.correo,usuarioUidDto.uid_codigo);
    if (existingUser) {
      return existingUser;
    }
    throw new ConflictException('No se encontro el usuario');

  }


  async putUser(usuarioUidDto:PutUserDto){
    const existingUser = await this.usuarioRepository.findByEmailAndUID(usuarioUidDto.correo,usuarioUidDto.uid_codigo);
    if (!existingUser) {
      throw new ConflictException('No se encontro el usuario');
    }
    existingUser.nombre=usuarioUidDto.nombre;
    existingUser.apellido_second=usuarioUidDto.apellido_second;
    existingUser.apellido_firts=usuarioUidDto.apellido_firts;
    existingUser.telefono=usuarioUidDto.telefono;
    existingUser.equipoIoT.numero_serie=usuarioUidDto.codigo_equipo_iot;
    existingUser.token_messagin=usuarioUidDto.token_messagin;
    const newuser = await this.usuarioRepository.putUsuario(existingUser);
    return newuser;
  }




}