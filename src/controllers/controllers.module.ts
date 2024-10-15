import { Module } from "@nestjs/common";
import { UsecasesModule } from "../core/useCases/usecases.module";
import { UsuarioController } from "./Usuario.Controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccidenteController } from "./AccidenteController";
import { FamiliarController } from "./FamiliarController";
import { PoliciaController } from "./PoliciaController";


@Module({
  imports:[UsecasesModule],
  controllers:[UsuarioController,AccidenteController,FamiliarController,PoliciaController]
})
export class ControllersModule {}