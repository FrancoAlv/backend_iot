import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accidente } from '../entities/Accidente';
import { Usuario } from '../entities/Usuario';
import { OpenAIAnalysisResult } from '../interfaces/OpenAIAnalysisResult';
import { AccidenteRepository } from "./AccidenteRepository";
import { VehiculoCercano } from "../entities/VehiculoCercano";
import { FotoTemporal } from "../entities/FotoTemporal";

@Injectable()
export class AccidenteRepositoryImpl implements AccidenteRepository {
  constructor(
    @InjectRepository(Accidente)
    private readonly repository: Repository<Accidente>,
  ) {

  }

  async save(usuario: Usuario, analysis: OpenAIAnalysisResult): Promise<void> {
    const accidente = new Accidente();
    accidente.usuario = usuario;
    accidente.fecha_hora = new Date();
    accidente.ubicacion_gps = analysis.gpsLocation;
    accidente.velocidad = analysis.distanceToUser || 0;
    accidente.descripcion = analysis.classification;

    await this.repository.save(accidente);
  }

  async savewithVehiculoCercano(usuario: Usuario, analysis: OpenAIAnalysisResult,streetname:string,url:string,publicid:string): Promise<Accidente> {
    const accidente = new Accidente();
    accidente.usuario = usuario;
    accidente.fecha_hora = new Date(Date.now());
    accidente.ubicacion_gps = analysis.gpsLocation;
    accidente.velocidad = analysis.distanceToUser || 0;
    accidente.descripcion = analysis.classification;
    accidente.vehiculosCercanos=[];
    let vehiculoCercanos=new VehiculoCercano();
    vehiculoCercanos.ubicacion_gps = analysis.gpsLocation;
    vehiculoCercanos.streetname=streetname;
    vehiculoCercanos.fecha_hora_acercamiento=new Date(Date.now());
    vehiculoCercanos.placa=analysis.licensePlate
    vehiculoCercanos.fotoTemporal=new FotoTemporal();
    const fechaActual = new Date();
    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaActual.getDate() + 2);
    vehiculoCercanos.fotoTemporal.url_foto=url;
    vehiculoCercanos.fotoTemporal.public_id=publicid;
    vehiculoCercanos.fotoTemporal.fecha_expiracion=fechaExpiracion;
    vehiculoCercanos.fotoTemporal.fecha_hora_captura=fechaActual;
    accidente.vehiculosCercanos.push(vehiculoCercanos);
   return   await this.repository.save(accidente);
  }
}