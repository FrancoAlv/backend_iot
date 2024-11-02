import { Usuario } from "../entities/Usuario";

export interface IUsuarioRepository {
  create(usuario: Usuario): Promise<Usuario>;

  putUsuario(usuario: Usuario): Promise<Usuario>;
  findByEmail(correo: string): Promise<Usuario | null>;
  findByEmailAndUID(correo: string,UID:string): Promise<Usuario | null>;
  findAll(): Promise<Usuario[]>;
  findById(usuarioId:number): Promise<Usuario>;
  findByUid(uid_codigo:string): Promise<Usuario| null>;
  findByIdWithAll(usuarioId:number,accidente_id:number): Promise<Usuario>;
  findByUidWithAll(uid_codigo:string,accidente_id:number): Promise<Usuario>;
  findByUidandemailwithall(uid: string,email:string)  :Promise<Usuario | null>;
}