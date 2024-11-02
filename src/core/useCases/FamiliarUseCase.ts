import { Inject, Injectable } from "@nestjs/common";
import { FamiliarDto } from '../dto/FamiliarDto';
import { Familiar } from '../entities/Familiar';
import { IFamiliarRepository } from "../data/IFamiliarRepository";
import { IUsuarioRepository } from "../data/IUsuarioRepository";

@Injectable()
export class FamiliarUseCase {
  constructor(
    @Inject("IFamiliarRepository") private readonly familiarRepository: IFamiliarRepository,
    @Inject("IUsuarioRepository") private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  async execute(usuarioId: number, familiarDto: FamiliarDto): Promise<Familiar> {
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const familiar = new Familiar();
    familiar.usuario = usuario;
    familiar.nombre = familiarDto.nombre;
    familiar.relacion = familiarDto.relacion;
    familiar.telefono = familiarDto.telefono;
    familiar.correo = familiarDto.correo;

    return  await this.familiarRepository.save(familiar);
  }

  async getAll(usuarioId: number): Promise<Familiar[]> {
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return await this.familiarRepository.findAllByUsuario(usuario);
  }

  async update(usuarioId: number, familiarId: number, familiarDto: FamiliarDto): Promise<void> {
    const familiar = await this.familiarRepository.findByIdAndUsuario(familiarId, usuarioId);
    if (!familiar) {
      throw new Error('Familiar no encontrado');
    }

    familiar.nombre = familiarDto.nombre;
    familiar.relacion = familiarDto.relacion;
    familiar.telefono = familiarDto.telefono;
    familiar.correo = familiarDto.correo;

    await this.familiarRepository.save(familiar);
  }

  async delete(usuarioId: number, familiarId: number): Promise<void> {
    const familiar = await this.familiarRepository.findByIdAndUsuario(familiarId, usuarioId);
    if (!familiar) {
      throw new Error('Familiar no encontrado');
    }

    await this.familiarRepository.delete(familiar);
  }
}