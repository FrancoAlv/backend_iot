import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { VehiculoCercano } from "./VehiculoCercano";

@Entity()
export class FotoTemporal {
  @PrimaryGeneratedColumn()
  foto_id: number;

  @OneToOne(() => VehiculoCercano, vehiculoCercano => vehiculoCercano.fotoTemporal)
  vehiculoCercano: VehiculoCercano;

  @Column()
  url_foto: string;

  @Column()
  public_id: string;

  @Column()
  fecha_hora_captura: Date;

  @Column()
  fecha_expiracion: Date;
}