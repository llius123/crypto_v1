import { Connection, ConnectionOptions, createConnection, FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { Configuracion } from "./database/entities/Configuracion";
import { Moneda } from "./database/entities/Moneda";
import { Precio } from "./database/entities/Precio";

export class DatabaseSQLiteV1<T> {

    private configuration: ConnectionOptions = {
        type: "sqlite",
        database: `database.sqlite`,
        entities: [Moneda, Precio, Configuracion],
        synchronize: true
    }

    public connection!: Connection

    public async openConnection(): Promise<void> {
        this.connection = await createConnection(this.configuration)
    }

    public async closeConnection(): Promise<void> {
        await this.connection.close()
    }

    public async save<T>(object: T[], entitie: any) {
        const repository = this.connection.getRepository(entitie as any)
        await repository.save(object)
    }

    public async find(entitie: any, options?: FindManyOptions<T>): Promise<T[]> {
        const repository: Repository<T> = this.connection.getRepository(entitie as any)
        const result: T[] = await repository.find(options)
        return result
    }

}