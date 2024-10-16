import { Module } from "@nestjs/common";
import { AppGateway } from "./app.gateway";
import { ServicesModule } from "../../services/services.module";
import { Observers } from "../observers/observers.module";
import { UsecasesModule } from "../useCases/usecases.module";

@Module({
  imports: [ServicesModule,Observers,UsecasesModule],
  providers: [AppGateway]
})
export class GatewaysModule {}