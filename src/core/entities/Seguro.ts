import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity()
export class Seguro {
  @PrimaryGeneratedColumn()
  seguro_id: number;

  @Column()
  nombre: string;

  @Column()
  telefono: string;

  @Column()
  correo: string;

  @OneToMany(() => Usuario, usuario => usuario.seguro, { eager: true })
  usuarios: Usuario[];
}
