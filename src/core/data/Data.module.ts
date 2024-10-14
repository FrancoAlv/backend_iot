import { Module } from "@nestjs/common";
import { IUsuarioRepository } from "./IUsuarioRepository";
import { UsuarioRepositoryImpl } from "./UsuarioRepositoryImpl";
import { RepositoryModule } from "../repositories/repository.module";


@Module({
  imports:[RepositoryModule],
  exports:[
    {provide :"IUsuarioRepository",useClass:UsuarioRepositoryImpl}
  ],
  providers:[
    {provide:"IUsuarioRepository",useClass:UsuarioRepositoryImpl}
  ]
})
export class DataModule {}