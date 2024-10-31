import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CloudinaryService } from '../../services/CloudinaryService';
import { OpenAIService } from '../../services/OpenAIService';
import { AccidenteDto } from '../dto/AccidenteDto';
import { EquipoIoT } from '../entities/EquipoIoT';
import { OpenAIAnalysisResult } from '../interfaces/OpenAIAnalysisResult';
import { AccidenteRepository } from "../data/AccidenteRepository";
import { EquipoIoTRepository } from "../data/EquipoIoTRepository";
import { WhatsAppService } from "../../services/WhatsAppService";
import { IFamiliarRepository } from "../data/IFamiliarRepository";
import { NotificationStateObserver } from "../observers/NotificationStateObserver";
import { IUsuarioRepository } from "../data/IUsuarioRepository";
import { Usuario } from "../entities/Usuario";
import { Accidente } from "../entities/Accidente";

@Injectable()
export class AccidenteUseCase {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly openAIService: OpenAIService,
    @Inject("IAccidenteRepository") private readonly accidenteRepository: AccidenteRepository,
    @Inject("IEquipoIoTRepository") private readonly equipoIoTRepository: EquipoIoTRepository,
    @Inject("IFamiliarRepository") private readonly familiarRepository: IFamiliarRepository,
    private readonly whatsAppService:WhatsAppService,
    private readonly notificationStateObserver:NotificationStateObserver,
    @Inject("IUsuarioRepository") private readonly usuarioRepository: IUsuarioRepository
  ) {}

  async notificarFamiliares(usuario_id: number,accidente_id:number) {
   const persona=  await this.usuarioRepository.findByIdWithAll(usuario_id,accidente_id);

   for (const familiar of persona.familiares){
     await this.whatsAppService.sendWhatsAppMessage(
       familiar.telefono,
       `El usuario ${persona.nombre} ah sufrido un accidente en la posicion  ${persona.accidentes?.map(accidente =>
         `GPS ${accidente?.ubicacion_gps} con posible placas: ${accidente.vehiculosCercanos.map(vehiculo =>
           ` ${vehiculo?.placa} la foto tomada es ${vehiculo?.fotoTemporal?.url_foto}  `
         )}`
       )}`
     );
   }

   for (const policia of persona.policias){
      await this.whatsAppService.sendWhatsAppMessage(
        policia.telefono,
        `El usuario ${persona.nombre} ah sufrido un accidente en la posicion  ${persona?.accidentes.map(accidente =>
          `GPS ${accidente?.ubicacion_gps} con posible placas: ${accidente?.vehiculosCercanos?.map(vehiculo =>
            ` ${vehiculo?.placa} la foto tomada es ${vehiculo?.fotoTemporal.url_foto}  `
          )}`
        )}`
      );
    }

    if (persona?.seguro?.telefono){
      await this.whatsAppService.sendWhatsAppMessage(
        persona.seguro.telefono,
        `El usuario ${persona.nombre} ah sufrido un accidente en la posicion  ${persona.accidentes?.map(accidente =>
          `GPS ${accidente?.ubicacion_gps} con posible placas: ${accidente?.vehiculosCercanos?.map(vehiculo =>
            ` ${vehiculo?.placa} la foto tomada es ${vehiculo?.fotoTemporal?.url_foto}  `
          )}`
        )}`
      );
    }
  }

  async execute(accidenteDto: AccidenteDto): Promise<{ analysis: OpenAIAnalysisResult[] }> {

    const equipo = await this.equipoIoTRepository.findByNumeroSerie(accidenteDto.numero_serie);

    if (!equipo) {
      throw new Error('Equipo IoT no encontrado');
    }

    const usuario = equipo.usuario;
    if (!usuario) {
      throw new Error('Usuario no encontrado para el equipo IoT');
    }

    // Upload the photo to Cloudinary
    const url = await this.cloudinaryService.uploadImage(accidenteDto.foto);
    const analysis = await this.openAIService.analyzeImage(url.secure_url);

    // Incorporate data from IoT device (e.g., GPS location, gyroscope data, distance to user)
    const gpsLocation = accidenteDto.ubicacion_gps;
    const distanceToUser = accidenteDto.cercania_vehiculo;
    const gyroscopeData = accidenteDto.giroscopio;

    const fullAnalysis: OpenAIAnalysisResult = { ...analysis, gpsLocation, distanceToUser, gyroscopeData };
    // Save accident information
    const accidente= await this.accidenteRepository.savewithVehiculoCercano(usuario, fullAnalysis,url.secure_url,url.name);
    if (fullAnalysis.accidentDetected){
      this.notificationStateObserver.notify(usuario.usuario_id,accidente.accidente_id, 'accidente_detectado');
    }
    return { analysis: [fullAnalysis] };
  }

  async findByUidandemailwithall(uid: string,email:string)  :Promise<Accidente[]>{
    const  usuario= await this.usuarioRepository.findByUidandemailwithall(uid,email);
    if (usuario){
      return usuario.accidentes ?? [];
    }

    throw new ConflictException('No se encuentra usuario');

  }



}