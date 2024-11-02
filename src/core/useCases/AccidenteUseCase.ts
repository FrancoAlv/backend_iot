import { ConflictException, Inject, Injectable, Logger } from "@nestjs/common";
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
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";

@Injectable()
export class AccidenteUseCase {

  private  apiKey:string = '';

  private readonly logger = new Logger(AccidenteUseCase.name);

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

  async notificarFamiliares(uid_codigo: string, accidente_id: number) {
    const persona = await this.usuarioRepository.findByUidWithAll(uid_codigo, accidente_id);

    if (!persona) {
      this.logger.error("No se encontró la información de la persona con el uid proporcionado.");
      return;
    }

    const mensajeBase = `,lamentamos informarle que ha ocurrido un accidente a ${persona.nombre} ${persona.apellido_firts} ${persona.apellido_second}. A continuación, se detalla la información disponible:`;

    const detallesAccidente = persona.accidentes?.map(accidente => {
      const ubicacionLink = `Ubicación: [Ver en Google Maps](https://www.google.com/maps/search/?api=1&query=${accidente.ubicacion_gps.replace(" ","")})`;
      const detallesVehiculos = accidente.vehiculosCercanos?.map(vehiculo =>
        `- Placa: ${vehiculo.placa}\n  - Foto de evidencia: ${vehiculo.fotoTemporal?.url_foto}`
      ).join('\n');

      return `${ubicacionLink}\nVehículos cercanos:\n${detallesVehiculos || 'No se encontraron vehículos cercanos.'}`;
    }).join('\n\n') || 'No se encontraron detalles del accidente.';

    const mensajeCompleto = `${mensajeBase}\n\n${detallesAccidente}`;
    this.logger.error(mensajeCompleto);
    // Notificar a los familiares
    for (const familiar of persona.familiares || []) {
      await this.whatsAppService.sendWhatsAppMessage(
        familiar.telefono,
        `Notificación de emergencia para familiar:\n\n Estimado(a) ${familiar.nombre}${mensajeCompleto}`
      );
    }

    // Notificar a la policía
    for (const policia of persona.policias || []) {
      await this.whatsAppService.sendWhatsAppMessage(
        policia.telefono,
        `Notificación de emergencia para personal policial:\n\nEstimado(a) ${policia.nombre}${mensajeCompleto}`
      );
    }

    // Notificar a la aseguradora
    if (persona.seguro?.telefono) {
      await this.whatsAppService.sendWhatsAppMessage(
        persona.seguro.telefono,
        `Notificación de emergencia para aseguradora:\n\nEstimado(a) ${persona.seguro.nombre}${mensajeCompleto}`
      );
    }

    this.logger.log("Notificaciones enviadas correctamente a los contactos asociados.");
  }



  async execute(accidenteDto: AccidenteDto): Promise<{ analysis: OpenAIAnalysisResult[] }> {

    const equipo = await this.equipoIoTRepository.findByNumeroSerie(accidenteDto.numero_serie);

    if (!equipo) {
      throw new NotFoundException('Equipo IoT no encontrado');
    }

    const usuario = equipo.usuario;
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado para el equipo IoT');
    }

    // Upload the photo to Cloudinary
    const url = await this.cloudinaryService.uploadImage(accidenteDto.foto);
    const analysis = await this.openAIService.analyzeImage(url.secure_url);

    // Incorporate data from IoT device (e.g., GPS location, gyroscope data, distance to user)
    const gpsLocation = accidenteDto.ubicacion_gps;
    const distanceToUser = accidenteDto.cercania_vehiculo;
    const gyroscopeData = accidenteDto.giroscopio;

    const fullAnalysis: OpenAIAnalysisResult = { ...analysis, gpsLocation, distanceToUser, gyroscopeData };
    let cordinates= gpsLocation.split(",");
    let streetname=  await this.getStreetName(parseFloat(cordinates[0].trim()),parseFloat(cordinates[1].trim()))
    // Save accident information
    const accidente= await this.accidenteRepository.savewithVehiculoCercano(usuario, fullAnalysis,streetname,url.secure_url,url.name);
    if (fullAnalysis.accidentDetected){
      this.notificationStateObserver.notify(usuario.token_messagin,usuario.uid_codigo,accidente.accidente_id, 'accidente_detectado');
    }
    return { analysis: [fullAnalysis] };
  }

  async findByUidandemailwithall(uid: string,email:string)  :Promise<Accidente[]>{
    const  usuario= await this.usuarioRepository.findByUidandemailwithall(uid,email);

    if (usuario){
      return  usuario.accidentes ?? [];
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