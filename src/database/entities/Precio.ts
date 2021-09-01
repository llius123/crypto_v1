import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Moneda } from "./Moneda"

@Entity("PRECIO")
export class Precio {
    @PrimaryGeneratedColumn({ name: "ID" })
    id?: number

    @Column({ name: "OPENTIME" })
    opentime?: number

    @Column({ name: "OPEN" })
    open!: number

    @Column({ name: "HIGH" })
    high!: number

    @Column({ name: "LOW" })
    low!: number

    @Column({ name: "CLOSE" })
    close!: number

    @Column({ name: "VOLUME" })
    volume!: number

    @Column({ name: "CLOSETIME" })
    closetime!: number

    @Column({ name: "TIMEFRAME" })
    timeframe!: string

    @ManyToOne(type => Moneda)
    @JoinColumn({ name: "MONEDA", referencedColumnName: "id" })
    moneda?: Moneda
}