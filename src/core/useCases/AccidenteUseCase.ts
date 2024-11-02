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
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AccidenteUseCase {

  private  apiKey:string = '';


  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly openAIService: OpenAIService,
    @Inject("IAccidenteRepository") private readonly accidenteRepository: AccidenteRepository,
    @Inject("IEquipoIoTRepository") private readonly equipoIoTRepository: EquipoIoTRepository,
    @Inject("IFamiliarRepository") private readonly familiarRepository: IFamiliarRepository,
    private readonly whatsAppService:WhatsAppService,
    private readonly notificationStateObserver:NotificationStateObserver,
    @Inject("IUsuarioRepository") private readonly usuarioRepository: IUsuarioRepository,
    private readonly httpService: HttpService,
    configService: ConfigService
  ) {
    this.apiKey=configService.get("google_key");
  }

  async notificarFamiliares(uid_codigo: string,accidente_id:number) {
   const persona=  await this.usuarioRepository.findByUidWithAll(uid_codigo,accidente_id);

   for (const familiar of persona?.familiares){
     await this.whatsAppService.sendWhatsAppMessage(
       familiar.telefono,
       `El usuario ${persona.nombre} ah sufrido un accidente en la posicion  ${persona.accidentes?.map(accidente =>
         `GPS ${accidente?.ubicacion_gps} con posible placas: ${accidente.vehiculosCercanos.map(vehiculo =>
           ` ${vehiculo?.placa} la foto tomada es ${vehiculo?.fotoTemporal?.url_foto}  `
         )}`
       )}`
     );
   }

   for (const policia of persona?.policias){
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
      this.notificationStateObserver.notify(usuario.token_messagin,usuario.usuario_id,accidente.accidente_id, 'accidente_detectado');
    }
    return { analysis: [fullAnalysis] };
  }

  async findByUidandemailwithall(uid: string,email:string)  :Promise<Accidente[]>{
    const  usuario= await this.usuarioRepository.findByUidandemailwithall(uid,email);

    if (usuario){
      return await Promise.all(  usuario.accidentes.map(async  value =>{
        let cordinates= value.ubicacion_gps.split(",");
        let streetname=  await this.getStreetName(parseFloat(cordinates[0].trim()),parseFloat(cordinates[1].trim()))
        return {...value, streetname:streetname};
      })) ?? [];
    }

    throw new ConflictException('No se encuentra usuario');

  }

  async getStreetName(latitude: number, longitude: number): Promise<string> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.apiKey}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

      if (data.status === 'OK' && data.results.length > 0) {

        if (data.results.length > 0) {
          const addressComponents = data.results[0].address_components;
          // Filtra para obtener solo el `short_name` de `locality`
          const localityComponent = addressComponents.find(component =>
            component.types.includes('locality')
          );
          return localityComponent ? localityComponent.short_name : 'Unknown';
        }
        return 'Unknown';
      } else {
        return 'Dirección no encontrada';
      }
    } catch (error) {
      console.error('Error al obtener dirección:', error.message);
      return 'Error al obtener dirección';
    }
  }



}