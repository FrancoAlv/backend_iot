import { Module } from "@nestjs/common";
import { DataModule } from "../data/Data.module";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { AccidenteUseCase } from "./AccidenteUseCase";
import { ServicesModule } from "../../services/services.module";
import { FamiliarUseCase } from "./FamiliarUseCase";


@Module({
  imports: [DataModule,ServicesModule],
  exports:[CreateUserUseCase,AccidenteUseCase,FamiliarUseCase],
  providers: [CreateUserUseCase,AccidenteUseCase,FamiliarUseCase]
})
export class UsecasesModule{}