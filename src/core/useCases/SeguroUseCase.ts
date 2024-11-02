import { Inject, Injectable } from "@nestjs/common";
import { SeguroDto } from '../dto/SeguroDto';
import { Seguro } from '../entities/Seguro';
import { ISeguroRepository } from "../data/ISeguroRepository";
import { IUsuarioRepository } from "../data/IUsuarioRepository";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";

@Injectable()
export class SeguroUseCase {
  constructor(
    @Inject("ISeguroRepository")   private readonly seguroRepository: ISeguroRepository,
    @Inject("IUsuarioRepository")   private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  async add(usuarioId: number, seguroDto: SeguroDto): Promise<void> {
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const seguro = new Seguro();
    seguro.nombre = seguroDto.nombre;
    seguro.telefono = seguroDto.telefono;
    seguro.correo = seguroDto.correo;
    seguro.usuarios = [usuario];

    await this.seguroRepository.save(seguro);
  }
  async getAll(usuarioId: number): Promise<SeguroDto[]> {
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return await this.seguroRepository.findAllByUsuario(usuario);
  }

  async update(usuarioId: number, seguroId: number, seguroDto: SeguroDto): Promise<void> {
    const seguro = await this.seguroRepository.findByIdAndUsuario(seguroId, usuarioId);
    if (!seguro) {
      throw new NotFoundException('Seguro no encontrado');
    }

    seguro.nombre = seguroDto.nombre;
    seguro.telefono = seguroDto.telefono;
    seguro.correo = seguroDto.correo;

    await this.seguroRepository.save(seguro);
  }

  async delete(usuarioId: number, seguroId: number): Promise<void> {
    const seguro = await this.seguroRepository.findByIdAndUsuario(seguroId, usuarioId);
    if (!seguro) {
      throw new NotFoundException('Seguro no encontrado');
    }

    await this.seguroRepository.delete(seguro);
  }
}
