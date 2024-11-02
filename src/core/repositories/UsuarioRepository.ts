import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Usuario } from "../entities/Usuario";

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
  ) {}

  async create(usuario: Usuario): Promise<Usuario> {
    return await this.repository.save(usuario);
  }

  async findByEmail(correo: string): Promise<Usuario | null> {
    return await this.repository.findOne({ where: { correo } });
  }

  async findByEmailAndUID(correo: string,UID:string): Promise<Usuario | null> {
    return await this.repository.findOne({ where: { correo,uid_codigo:UID },relations:["equipoIoT"] });
  }
  async putUsuario(usuario: Usuario): Promise<Usuario>{
    return  this.repository.save(usuario);
  }
  async findAll(): Promise<Usuario[] | null> {
    return await this.repository.find();
  }

  async findById(usuarioId: number)  :Promise<Usuario | null>{
    return await this.repository.findOne({
     where:{
       usuario_id: usuarioId,
     }
    });
  }

  async findByUid(uid_codigo: string)  :Promise<Usuario | null>{
    return await this.repository.findOne({
      where:{
        uid_codigo: uid_codigo,
      }
    });
  }

  async findByIdwithall(usuarioId: number,accidente_id:number)  :Promise<Usuario | null>{
    return await this.repository.findOne({
      where:{
        usuario_id: usuarioId,
        accidentes:{
          accidente_id:accidente_id
        }
      },
      relations:["familiares","accidentes","policias","seguro","accidentes.vehiculosCercanos","accidentes.vehiculosCercanos.fotoTemporal"]
    });
  }

  async findByUidWithAll(uid_codigo: string,accidente_id:number)  :Promise<Usuario | null>{
    return await this.repository.findOne({
      where:{
        uid_codigo: uid_codigo,
        accidentes:{
          accidente_id:accidente_id
        }
      },
      relations:["familiares","accidentes","policias","seguro","accidentes.vehiculosCercanos","accidentes.vehiculosCercanos.fotoTemporal"]
    });
  }

  async findByUidandemailwithall(uid: string,email:string)  :Promise<Usuario | null>{
    return await this.repository.findOne({
      where:{
        correo:email,
        uid_codigo:uid
      },
      relations:["accidentes","accidentes.vehiculosCercanos","accidentes.vehiculosCercanos.fotoTemporal"]
    });
  }


}
