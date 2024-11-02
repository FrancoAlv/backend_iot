import { Policia } from '../entities/Policia';
import { Usuario } from '../entities/Usuario';

export abstract class IPoliciaRepository {
  abstract save(policia: Policia): Promise<void>;
  abstract findAllByUsuario(usuario: Usuario): Promise<Policia[]>;
  abstract findByIdAndUsuario(policiaId: number, uid_codigo: string): Promise<Policia | null>;
  abstract delete(policia: Policia): Promise<void>;
}