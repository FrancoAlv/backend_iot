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

  @Column({nullable: true})
  telefono: string;

  @Column({nullable: true})
  correo: string;

  @Column({nullable: true,unique: true})
  place_id: string;

  @Column({nullable: true})
  gps: string;

  @Column({nullable: true})
  isActive: boolean;

  @ManyToOne(() => Usuario, usuario => usuario.policias)
  usuario: Usuario;
}