import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { NotificacionEmergencia } from "./NotificacionEmergencia";
import { VehiculoCercano } from "./VehiculoCercano";

@Entity()
export class Accidente {
  @PrimaryGeneratedColumn()
  accidente_id: number;

  @ManyToOne(() => Usuario, usuario => usuario.accidentes)
  usuario: Usuario;

  @Column()
  fecha_hora: Date;

  @Column()
  ubicacion_gps: string;

  @Column()
  velocidad: number;

  @Column()
  descripcion: string;

  @OneToMany(() => VehiculoCercano, vehiculoCercano => vehiculoCercano.accidente, { cascade: true })
  vehiculosCercanos: VehiculoCercano[];

  @OneToMany(() => NotificacionEmergencia, notificacion => notificacion.accidente, { cascade: true })
  notificaciones: NotificacionEmergencia[];
}