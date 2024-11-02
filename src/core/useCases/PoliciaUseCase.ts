import { Inject, Injectable } from "@nestjs/common";
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { PoliciaDto } from '../dto/PoliciaDto';
import { Policia } from '../entities/Policia';
import { IPoliciaRepository } from "../data/IPoliciaRepository";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import { IUsuarioRepository } from "../data/IUsuarioRepository";

@Injectable()
export class PoliciaUseCase {
  constructor(
    @Inject("IPoliciaRepository")   private readonly policiaRepository: IPoliciaRepository,
    @Inject("IUsuarioRepository")  private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  async add(uid_codigo: string, policiaDto: PoliciaDto): Promise<void> {
    const usuario = await this.usuarioRepository.findByUid(uid_codigo);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const policia = new Policia();
    policia.usuario = usuario;
    policia.nombre = policiaDto.nombre;
    policia.telefono = policiaDto.telefono;
    policia.correo = policiaDto.correo;

    await this.policiaRepository.save(policia);
  }

  async getAll(uid_codigo: string): Promise<Policia[]> {
    const usuario = await this.usuarioRepository.findByUid(uid_codigo);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return await this.policiaRepository.findAllByUsuario(usuario);
  }

  async update(uid_codigo: string, policiaId: number, policiaDto: PoliciaDto): Promise<void> {
    const policia = await this.policiaRepository.findByIdAndUsuario(policiaId, uid_codigo);
    if (!policia) {
      throw new NotFoundException('Policía no encontrado');
    }

    policia.nombre = policiaDto.nombre;
    policia.telefono = policiaDto.telefono;
    policia.correo = policiaDto.correo;

    await this.policiaRepository.save(policia);
  }

  async delete(uid_codigo: string, policiaId: number): Promise<void> {
    const policia = await this.policiaRepository.findByIdAndUsuario(policiaId, uid_codigo);
    if (!policia) {
      throw new NotFoundException('Policía no encontrado');
    }

    await this.policiaRepository.delete(policia);
  }
}
