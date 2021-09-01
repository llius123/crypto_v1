import { Precio } from './Precio';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Configuracion } from './Configuracion';


@Entity("MONEDA")
export class Moneda {
    @PrimaryGeneratedColumn({ name: "ID" })
    id?: number

    @Column({ name: "NOMBRE" })
    nombre!: string

    @OneToMany(type => Precio, precio => precio.moneda)
    precio?: Precio[]

    @OneToMany(type => Configuracion, configuracion => configuracion.moneda)
    configuracion?: Configuracion[]
}