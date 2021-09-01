import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne } from "typeorm"
import { Moneda } from './Moneda';
import { Precio } from "./Precio";


@Entity("CONFIGURACION")
export class Configuracion {
    @PrimaryGeneratedColumn({ name: "ID" })
    id?: number

    @ManyToOne(type => Moneda)
    @JoinColumn({ name: "MONEDA", referencedColumnName: "id" })
    moneda?: Moneda

    @OneToOne(() => Precio)
    @JoinColumn({ name: 'PRECIO' })
    precio?: Precio;

    @Column({ name: "RSI" })
    rsi!: string

    @Column({ name: "TIMEFRAME" })
    timeframe!: string

}