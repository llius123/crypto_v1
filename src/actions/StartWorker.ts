import { BinanceV1 } from "../BinanceV1";
import { Moneda } from "../database/entities/Moneda";
import { Precio } from "../database/entities/Precio";
import { DatabaseSQLiteV1 } from "../DatabaseSQLiteV1";
import { Time, WorkerV1 } from "../WorkerV1";

export class StartWorker {
    run(times: Time[], moneda: string, timeframe: string) {
        const workerV1 = new WorkerV1()
        workerV1.startWorkers(times, () => {
            this.getDataFromBinance(moneda, timeframe)
        })
    }
    private async getDataFromBinance(moneda: string, timeframe: string) {

        const database = new DatabaseSQLiteV1()
        await database.openConnection()
        const connection = database.connection
        const monedaRepository = connection.getRepository(Moneda)
        const monedas: Moneda[] = []

        if (moneda.length > 0) {
            const data: Moneda = await monedaRepository.findOne({ where: { nombre: moneda } }) as Moneda
            monedas.push(data)
        } else {
            const data: Moneda[] = await monedaRepository.find()
            monedas.push(...data)
        }
        database.closeConnection()


        const binanceV1 = new BinanceV1()
        binanceV1.getPrice(monedas, timeframe, (precio: Precio) => {
            this.savePrecio(precio)
        })
    }

    private async savePrecio(precio: Precio) {
        const database = new DatabaseSQLiteV1()
        await database.openConnection()
        const connection = database.connection
        const precioRepository = connection.getRepository(Precio)
        await precioRepository.save(precio)
        database.closeConnection()
    }

}