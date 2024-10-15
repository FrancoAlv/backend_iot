import { Module } from "@nestjs/common";
import { UsuarioRepositoryImpl } from "./UsuarioRepositoryImpl";
import { RepositoryModule } from "../repositories/repository.module";
import { EquipoIoTRepositoryImpl } from "./EquipoIoTRepositoryImpl";
import { AccidenteRepositoryImpl } from "./AccidenteRepositoryImpl";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "../entities/Usuario";
import { EquipoIoT } from "../entities/EquipoIoT";
import { Accidente } from "../entities/Accidente";
import { FotoTemporal } from "../entities/FotoTemporal";
import { VehiculoCercano } from "../entities/VehiculoCercano";
import { ServicesModule } from "../../services/services.module";


@Module({
  imports:[RepositoryModule,ServicesModule,TypeOrmModule.forFeature([Usuario,EquipoIoT,Accidente,FotoTemporal,VehiculoCercano])],
  exports:[
    {provide :"IUsuarioRepository",useClass:UsuarioRepositoryImpl},
    {provide :"IAccidenteRepository",useClass:AccidenteRepositoryImpl},
    {provide :"IEquipoIoTRepository",useClass:EquipoIoTRepositoryImpl}
  ],
  providers:[
    {provide:"IUsuarioRepository",useClass:UsuarioRepositoryImpl},
    {provide :"IAccidenteRepository",useClass:AccidenteRepositoryImpl},
    {provide :"IEquipoIoTRepository",useClass:EquipoIoTRepositoryImpl}
  ]
})
export class DataModule {}