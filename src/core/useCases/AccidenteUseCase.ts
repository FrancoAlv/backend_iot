import { Inject, Injectable } from "@nestjs/common";
import { CloudinaryService } from '../../services/CloudinaryService';
import { OpenAIService } from '../../services/OpenAIService';
import { AccidenteDto } from '../dto/AccidenteDto';
import { EquipoIoT } from '../entities/EquipoIoT';
import { OpenAIAnalysisResult } from '../interfaces/OpenAIAnalysisResult';
import { AccidenteRepository } from "../data/AccidenteRepository";
import { EquipoIoTRepository } from "../data/EquipoIoTRepository";

@Injectable()
export class AccidenteUseCase {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly openAIService: OpenAIService,
    @Inject("IAccidenteRepository") private readonly accidenteRepository: AccidenteRepository,
    @Inject("IEquipoIoTRepository") private readonly equipoIoTRepository: EquipoIoTRepository,
  ) {}

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
    console.log(fullAnalysis);
    // Save accident information
    await this.accidenteRepository.savewithVehiculoCercano(usuario, fullAnalysis,url.secure_url,url.name);

    return { analysis: [fullAnalysis] };
  }
}