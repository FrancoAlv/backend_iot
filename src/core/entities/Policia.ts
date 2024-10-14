// Modelo Policia
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NotificacionEmergencia } from "./NotificacionEmergencia";
import { Usuario } from "./Usuario";

@Entity()
export class Policia {
  @PrimaryGeneratedColumn()
  policia_id: number;

  @Column()
  nombre: string;

  @Column()
  telefono: string;

  @Column()
  correo: string;

  @ManyToOne(() => Usuario, usuario => usuario.policias)
  usuario: Usuario;
}