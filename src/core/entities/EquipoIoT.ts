import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity()
export class EquipoIoT {
  @PrimaryGeneratedColumn()
  equipo_iot_id: number;

  @Column()
  modelo: string;

  @Column()
  numero_serie: string;

  @OneToOne(() => Usuario, usuario => usuario.equipoIoT)
  usuario: Usuario;
}