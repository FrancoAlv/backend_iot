import { Inject, Injectable } from "@nestjs/common";
import { FamiliarDto } from '../dto/FamiliarDto';
import { Familiar } from '../entities/Familiar';
import { IFamiliarRepository } from "../data/IFamiliarRepository";
import { IUsuarioRepository } from "../data/IUsuarioRepository";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";

@Injectable()
export class FamiliarUseCase {
  constructor(
    @Inject("IFamiliarRepository") private readonly familiarRepository: IFamiliarRepository,
    @Inject("IUsuarioRepository") private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  async execute(uid_codigo: string, familiarDto: FamiliarDto): Promise<Familiar> {
    const usuario = await this.usuarioRepository.findByUid(uid_codigo);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const familiar = new Familiar();
    familiar.usuario = usuario;
    familiar.nombre = familiarDto.nombre;
    familiar.relacion = familiarDto.relacion;
    familiar.telefono = familiarDto.telefono;
    familiar.correo = familiarDto.correo;

    return  await this.familiarRepository.save(familiar);
  }

  async getAll(uid_codigo: string): Promise<Familiar[]> {
    const usuario = await this.usuarioRepository.findByUid(uid_codigo);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return await this.familiarRepository.findAllByUsuario(usuario);
  }

  async update(uid_codigo: string, familiarId: number, familiarDto: FamiliarDto): Promise<void> {
    const familiar = await this.familiarRepository.findByIdAndUsuario(familiarId, uid_codigo);
    if (!familiar) {
      throw new NotFoundException('Familiar no encontrado');
    }

    familiar.nombre = familiarDto.nombre;
    familiar.relacion = familiarDto.relacion;
    familiar.telefono = familiarDto.telefono;
    familiar.correo = familiarDto.correo;

    await this.familiarRepository.save(familiar);
  }

  async delete(uid_codigo: string, familiarId: number): Promise<void> {
    const familiar = await this.familiarRepository.findByIdAndUsuario(familiarId, uid_codigo);
    if (!familiar) {
      throw new NotFoundException('Familiar no encontrado');
    }

    await this.familiarRepository.delete(familiar);
  }
}