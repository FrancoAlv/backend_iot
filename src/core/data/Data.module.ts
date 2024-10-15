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
import { PoliciaRepositoryImpl } from "./PoliciaRepositoryImpl";
import { SeguroRepositoryImpl } from "./SeguroRepositoryImpl";
import { Seguro } from "../entities/Seguro";


@Module({
  imports:[RepositoryModule,ServicesModule,TypeOrmModule.forFeature([Usuario,EquipoIoT,Accidente,FotoTemporal,VehiculoCercano,Familiar,Policia,Seguro])],
  exports:[
    {provide :"IUsuarioRepository",useClass:UsuarioRepositoryImpl},
    {provide :"IAccidenteRepository",useClass:AccidenteRepositoryImpl},
    {provide :"IEquipoIoTRepository",useClass:EquipoIoTRepositoryImpl},
    {provide :"IFamiliarRepository",useClass:FamiliarRepositoryImpl},
    {provide :"IPoliciaRepository",useClass:PoliciaRepositoryImpl},
    {provide :"ISeguroRepository",useClass:SeguroRepositoryImpl},
  ],
  providers:[
    {provide:"IUsuarioRepository",useClass:UsuarioRepositoryImpl},
    {provide :"IAccidenteRepository",useClass:AccidenteRepositoryImpl},
    {provide :"IEquipoIoTRepository",useClass:EquipoIoTRepositoryImpl},
    {provide :"IFamiliarRepository",useClass:FamiliarRepositoryImpl},
    {provide :"IPoliciaRepository",useClass:PoliciaRepositoryImpl},
    {provide :"ISeguroRepository",useClass:SeguroRepositoryImpl},
  ]
})
export class DataModule {}