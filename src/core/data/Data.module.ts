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
import { FamiliarRepositoryImpl } from "./FamiliarRepositoryImpl";
import { Familiar } from "../entities/Familiar";


@Module({
  imports:[RepositoryModule,ServicesModule,TypeOrmModule.forFeature([Usuario,EquipoIoT,Accidente,FotoTemporal,VehiculoCercano,Familiar])],
  exports:[
    {provide :"IUsuarioRepository",useClass:UsuarioRepositoryImpl},
    {provide :"IAccidenteRepository",useClass:AccidenteRepositoryImpl},
    {provide :"IEquipoIoTRepository",useClass:EquipoIoTRepositoryImpl},
    {provide :"IFamiliarRepository",useClass:FamiliarRepositoryImpl},
  ],
  providers:[
    {provide:"IUsuarioRepository",useClass:UsuarioRepositoryImpl},
    {provide :"IAccidenteRepository",useClass:AccidenteRepositoryImpl},
    {provide :"IEquipoIoTRepository",useClass:EquipoIoTRepositoryImpl},
    {provide :"IFamiliarRepository",useClass:FamiliarRepositoryImpl},
  ]
})
export class DataModule {}