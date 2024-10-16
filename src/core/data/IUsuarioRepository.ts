import { Usuario } from "../entities/Usuario";

export interface IUsuarioRepository {
  create(usuario: Usuario): Promise<Usuario>;
  findByEmail(correo: string): Promise<Usuario | null>;
  findAll(): Promise<Usuario[]>;
  findById(usuarioId:number): Promise<Usuario>;

  findByIdWithAll(usuarioId:number,accidente_id:number): Promise<Usuario>;
}