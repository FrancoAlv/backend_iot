import { EquipoIoT } from '../entities/EquipoIoT';

export abstract class EquipoIoTRepository {
  abstract findByNumeroSerie(numeroSerie: string): Promise<EquipoIoT | null>;
}
