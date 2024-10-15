export class AccidenteDto {
  numero_serie: string;
  velocidad: number;
  foto: string; // base64 string of the photo
  cercania_vehiculo?: number;
  ubicacion_gps?: string;
  giroscopio?: string;
}