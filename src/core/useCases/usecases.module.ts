import { Module } from "@nestjs/common";
import { DataModule } from "../data/Data.module";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { AccidenteUseCase } from "./AccidenteUseCase";
import { ServicesModule } from "../../services/services.module";


@Module({
  imports: [DataModule,ServicesModule],
  exports:[CreateUserUseCase,AccidenteUseCase],
  providers: [CreateUserUseCase,AccidenteUseCase]
})
export class UsecasesModule{}