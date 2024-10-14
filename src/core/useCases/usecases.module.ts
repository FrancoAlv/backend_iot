import { Module } from "@nestjs/common";
import { DataModule } from "../data/Data.module";
import { CreateUserUseCase } from "./CreateUserUseCase";


@Module({
  imports: [DataModule],
  exports:[CreateUserUseCase],
  providers: [CreateUserUseCase]
})
export class UsecasesModule{}