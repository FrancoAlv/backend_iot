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
import { Policia } from "../entities/Policia";
import { IPoliciaRepository } from "./IPoliciaRepository";
import { PoliciaRepositoryImpl } from "./PoliciaRepositoryImpl";


@Module({
  imports:[RepositoryModule,ServicesModule,TypeOrmModule.forFeature([Usuario,EquipoIoT,Accidente,FotoTemporal,VehiculoCercano,Familiar,Policia])],
  exports:[
    {provide :"IUsuarioRepository",useClass:UsuarioRepositoryImpl},
    {provide :"IAccidenteRepository",useClass:AccidenteRepositoryImpl},
    {provide :"IEquipoIoTRepository",useClass:EquipoIoTRepositoryImpl},
    {provide :"IFamiliarRepository",useClass:FamiliarRepositoryImpl},
    {provide :"IPoliciaRepository",useClass:PoliciaRepositoryImpl},
  ],
  providers:[
    {provide:"IUsuarioRepository",useClass:UsuarioRepositoryImpl},
    {provide :"IAccidenteRepository",useClass:AccidenteRepositoryImpl},
    {provide :"IEquipoIoTRepository",useClass:EquipoIoTRepositoryImpl},
    {provide :"IFamiliarRepository",useClass:FamiliarRepositoryImpl},
    {provide :"IPoliciaRepository",useClass:PoliciaRepositoryImpl},
  ]
})
export class DataModule {}