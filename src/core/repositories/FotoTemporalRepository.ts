import { FotoTemporal } from '../entities/FotoTemporal';
import { Usuario } from '../entities/Usuario';

export abstract class FotoTemporalRepository {
  abstract save(urls: string[], usuario: Usuario): Promise<void>;
}