import { Familiar } from '../entities/Familiar';
import { Usuario } from "../entities/Usuario";

export abstract class IFamiliarRepository {
  abstract save(familiar: Familiar): Promise<Familiar>;

  abstract findAllByUsuario(usuario: Usuario): Promise<Familiar[]>;
  abstract findByIdAndUsuario(familiarId: number, uid_codigo: string): Promise<Familiar | null>;
  abstract delete(familiar: Familiar): Promise<void>;
}