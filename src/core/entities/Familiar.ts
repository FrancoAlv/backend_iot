import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity()
export class Familiar {
  @PrimaryGeneratedColumn()
  familiar_id: number;

  @ManyToOne(() => Usuario, usuario => usuario.familiares)
  usuario: Usuario;

  @Column()
  nombre: string;

  @Column()
  telefono: string;

  @Column()
  correo: string;

  @Column()
  relacion: string;

  @Column({nullable: true})
  isActive: boolean;

}