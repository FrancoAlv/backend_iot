import { Inject, Injectable } from "@nestjs/common";
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { PoliciaDto } from '../dto/PoliciaDto';
import { Policia } from '../entities/Policia';
import { IPoliciaRepository } from "../data/IPoliciaRepository";

@Injectable()
export class PoliciaUseCase {
  constructor(
    @Inject("IPoliciaRepository")   private readonly policiaRepository: IPoliciaRepository,
    @Inject("IUsuarioRepository")  private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async add(usuarioId: number, policiaDto: PoliciaDto): Promise<void> {
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const policia = new Policia();
    policia.usuario = usuario;
    policia.nombre = policiaDto.nombre;
    policia.telefono = policiaDto.telefono;
    policia.correo = policiaDto.correo;

    await this.policiaRepository.save(policia);
  }

  async getAll(usuarioId: number): Promise<PoliciaDto[]> {
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return await this.policiaRepository.findAllByUsuario(usuario);
  }

  async update(usuarioId: number, policiaId: number, policiaDto: PoliciaDto): Promise<void> {
    const policia = await this.policiaRepository.findByIdAndUsuario(policiaId, usuarioId);
    if (!policia) {
      throw new Error('Policía no encontrado');
    }

    policia.nombre = policiaDto.nombre;
    policia.telefono = policiaDto.telefono;
    policia.correo = policiaDto.correo;

    await this.policiaRepository.save(policia);
  }

  async delete(usuarioId: number, policiaId: number): Promise<void> {
    const policia = await this.policiaRepository.findByIdAndUsuario(policiaId, usuarioId);
    if (!policia) {
      throw new Error('Policía no encontrado');
    }

    await this.policiaRepository.delete(policia);
  }
}
