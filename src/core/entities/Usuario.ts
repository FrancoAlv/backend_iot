import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EquipoIoT } from "./EquipoIoT";
import { Familiar } from "./Familiar";
import { Accidente } from "./Accidente";
import { Seguro } from "./Seguro";
import { Policia } from "./Policia";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  usuario_id: number;

  @Column()
  nombre: string;

  @Column()
  apellido_firts: string;

  @Column()
  apellido_second: string;

  @Column()
  correo: string;

  @Column()
  telefono: string;

  @Column()
  uid_codigo: string;

  @OneToOne(() => EquipoIoT, equipoIoT => equipoIoT.usuario, { cascade: true })
  @JoinColumn()
  equipoIoT: EquipoIoT;

  @OneToMany(() => Familiar, familiar => familiar.usuario, { cascade: true })
  familiares: Familiar[];

  @OneToMany(() => Accidente, accidente => accidente.usuario, { cascade: true })
  accidentes: Accidente[];

  @ManyToOne(() => Seguro, seguro => seguro.usuarios, { cascade: true })
  seguro: Seguro;


  @OneToMany(() => Policia, policia => policia.usuario, { cascade: true })
  policias: Policia[]
}
