import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Accidente } from "./Accidente";

@Entity()
export class NotificacionEmergencia {
  @PrimaryGeneratedColumn()
  notificacion_id: number;

  @ManyToOne(() => Accidente, accidente => accidente.notificaciones)
  accidente: Accidente;

  @Column()
  tipo: string; // Puede ser 'policía' o 'familiar'

  @Column()
  destinatario: string; // Puede ser el teléfono o el correo del destinatario

  @Column()
  estado: string; // 'enviada', 'pendiente', 'fallida'
}