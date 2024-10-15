import { Module } from "@nestjs/common";
import { UsecasesModule } from "../core/useCases/usecases.module";
import { UsuarioController } from "./Usuario.Controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccidenteController } from "./AccidenteController";


@Module({
  imports:[UsecasesModule],
  controllers:[UsuarioController,AccidenteController]
})
export class ControllersModule {}