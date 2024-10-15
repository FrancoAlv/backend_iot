import { Seguro } from '../entities/Seguro';
import { Usuario } from '../entities/Usuario';

export abstract class ISeguroRepository {
  abstract save(seguro: Seguro): Promise<void>;
  abstract findAllByUsuario(usuario: Usuario): Promise<Seguro[]>;
  abstract findByIdAndUsuario(seguroId: number, usuarioId: number): Promise<Seguro | null>;
  abstract delete(seguro: Seguro): Promise<void>;
}
