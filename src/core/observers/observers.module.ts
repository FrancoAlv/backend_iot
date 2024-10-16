import { Module } from "@nestjs/common";
import { NotificationStateObserver } from "./NotificationStateObserver";



@Module({
  imports: [],
  providers: [NotificationStateObserver],
  exports:[NotificationStateObserver]
})
export class Observers {}