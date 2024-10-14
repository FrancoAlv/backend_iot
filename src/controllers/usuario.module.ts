import { Module } from "@nestjs/common";
import { UsecasesModule } from "../core/useCases/usecases.module";
import { UsuarioController } from "./UsuarioController";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
  imports:[UsecasesModule],
  controllers:[UsuarioController]
})
export class UsuarioModule{}