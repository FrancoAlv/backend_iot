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
}
