import { Inject, Injectable, Logger } from "@nestjs/common";
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { PoliciaDto } from '../dto/PoliciaDto';
import { Policia } from '../entities/Policia';
import { IPoliciaRepository } from "../data/IPoliciaRepository";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import { IUsuarioRepository } from "../data/IUsuarioRepository";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

@Injectable()
export class PoliciaUseCase {

  private readonly logger = new Logger(PoliciaUseCase.name);

  private readonly apiKey: string;

  constructor(
    @Inject("IPoliciaRepository")   private readonly policiaRepository: IPoliciaRepository,
    @Inject("IUsuarioRepository")  private readonly usuarioRepository: IUsuarioRepository,
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.apiKey = configService.get("google_key");
  }

  async findNearbyPolicias(uid_codigo: string, lat: number, lng: number, radius: number): Promise<void> {
    const usuario = await this.usuarioRepository.findByUid(uid_codigo);
    if (!usuario) {
      throw new NotFoundException("Usuario no encontrado");
    }

    // Llamar a Google Places API para buscar comisarías cercanas
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=police&key=${this.apiKey}`;
    const response = await lastValueFrom(this.httpService.get(url));

    if (response.status !== 200) {
      throw new Error("Error al consultar Google Places API");
    }

    const places = response.data.results;
    if (!places || places.length === 0) {
      throw new NotFoundException("No se encontraron comisarías cercanas");
    }

    // Guardar cada comisaría en la base de datos
    for (const place of places) {
      const existplace= await this.policiaRepository.findByplaceId(usuario,place.place_id)
      this.logger.log(existplace)
      if (!!existplace){
        continue;
      }
      const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,geometry&key=${this.apiKey}`;
      const detailsResponse = await lastValueFrom(this.httpService.get(placeDetailsUrl));

      if (detailsResponse.status !== 200 || !detailsResponse.data.result) {
        continue; // Si falla una solicitud de detalles, continuar con el siguiente lugar
      }

      const details = detailsResponse.data.result;

      const policia = new Policia();
      policia.usuario = usuario;
      policia.place_id=place.place_id;
      policia.nombre = details.name || "Comisaría desconocida";
      policia.telefono = details.formatted_phone_number || "";
      policia.gps = `${details.geometry.location.lat},${details.geometry.location.lng}`;
      policia.isActive = true; // Asumimos que las comisarías encontradas están activas

      await this.policiaRepository.save(policia);
    }
  }

  async add(uid_codigo: string, policiaDto: PoliciaDto): Promise<void> {
    const usuario = await this.usuarioRepository.findByUid(uid_codigo);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const policia = new Policia();
    policia.usuario = usuario;
    policia.nombre = policiaDto.nombre;
    policia.telefono = policiaDto.telefono;
    policia.correo = policiaDto.correo;
    policia.gps = policiaDto.gps;
    policia.isActive = policiaDto.isActive;

    await this.policiaRepository.save(policia);
  }

  async getAll(uid_codigo: string): Promise<Policia[]> {
    const usuario = await this.usuarioRepository.findByUid(uid_codigo);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return await this.policiaRepository.findAllByUsuario(usuario);
  }

  async update(uid_codigo: string, policiaId: number, policiaDto: PoliciaDto): Promise<void> {
    const policia = await this.policiaRepository.findByIdAndUsuario(policiaId, uid_codigo);
    if (!policia) {
      throw new NotFoundException('Policía no encontrado');
    }

    policia.nombre = policiaDto.nombre;
    policia.telefono = policiaDto.telefono;
    policia.correo = policiaDto.correo;
    policia.gps = policiaDto.gps;
    policia.isActive = policiaDto.isActive;

    await this.policiaRepository.save(policia);
  }

  async delete(uid_codigo: string, policiaId: number): Promise<void> {
    const policia = await this.policiaRepository.findByIdAndUsuario(policiaId, uid_codigo);
    if (!policia) {
      throw new NotFoundException('Policía no encontrado');
    }

    await this.policiaRepository.delete(policia);
  }
}
