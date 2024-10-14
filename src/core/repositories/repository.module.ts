import { Module } from "@nestjs/common";
import { UsuarioRepository } from "./UsuarioRepository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "../entities/Usuario";
import { EquipoIoT } from "../entities/EquipoIoT";


@Module({
  imports:[TypeOrmModule.forFeature([Usuario,EquipoIoT])],
  exports:[UsuarioRepository],
  providers:[UsuarioRepository]
})
export class RepositoryModule{}