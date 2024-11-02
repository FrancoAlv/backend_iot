import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Accidente } from "./Accidente";
import { FotoTemporal } from "./FotoTemporal";

@Entity()
export class VehiculoCercano {
  @PrimaryGeneratedColumn()
  vehiculo_cercano_id: number;

  @ManyToOne(() => Accidente, accidente => accidente.vehiculosCercanos)
  accidente: Accidente;

  @Column()
  placa: string;

  @Column()
  ubicacion_gps: string;

  @Column({nullable: true})
  streetname: string;

  @Column()
  fecha_hora_acercamiento: Date;

  @OneToOne(() => FotoTemporal, fotoTemporal => fotoTemporal.vehiculoCercano, { cascade: true })
  @JoinColumn()
  fotoTemporal: FotoTemporal;
}