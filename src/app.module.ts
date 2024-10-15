import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Accidente } from "./core/entities/Accidente";
import { EquipoIoT } from "./core/entities/EquipoIoT";
import { Familiar } from "./core/entities/Familiar";
import { FotoTemporal } from "./core/entities/FotoTemporal";
import { NotificacionEmergencia } from "./core/entities/NotificacionEmergencia";
import { Usuario } from "./core/entities/Usuario";
import { VehiculoCercano } from "./core/entities/VehiculoCercano";
import { Seguro } from "./core/entities/Seguro";
import { Policia } from "./core/entities/Policia";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { ControllersModule } from "./controllers/controllers.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ControllersModule,
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Accidente,EquipoIoT,Familiar,FotoTemporal,NotificacionEmergencia,Usuario,VehiculoCercano,Seguro,Policia], // Entidades que utilizarás
      synchronize: true,
      dropSchema:false,
      options: {
        encrypt: false,
      },
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
