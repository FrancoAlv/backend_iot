import { Module } from "@nestjs/common";
import { DataModule } from "../data/Data.module";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { AccidenteUseCase } from "./AccidenteUseCase";
import { ServicesModule } from "../../services/services.module";
import { FamiliarUseCase } from "./FamiliarUseCase";
import { PoliciaUseCase } from "./PoliciaUseCase";
import { SeguroUseCase } from "./SeguroUseCase";


@Module({
  imports: [DataModule,ServicesModule],
  exports:[CreateUserUseCase,AccidenteUseCase,FamiliarUseCase,PoliciaUseCase,SeguroUseCase],
  providers: [CreateUserUseCase,AccidenteUseCase,FamiliarUseCase,PoliciaUseCase,SeguroUseCase]
})
export class UsecasesModule{}