import { WorkerV1 } from './WorkerV1';
import { Moneda } from "./database/entities/Moneda";
import { Precio } from "./database/entities/Precio";
import { BinanceV1 } from "./BinanceV1";
import { DatabaseSQLiteV1 } from "./DatabaseSQLiteV1";

import express from 'express';
const app = express()
const port = 3000

app.get('/lel', async (req: any, res: any) => {
    res.send({ url: '/lel' })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



export class IndexV1 {
    async guardarDatosHistoricos() {
        const binanceV1 = new BinanceV1()
        const databaseSQLiteV1Moneda = new DatabaseSQLiteV1<Moneda>()
        await databaseSQLiteV1Moneda.openConnection()
        const data = await databaseSQLiteV1Moneda.find(Moneda, { where: { nombre: 'BTCUSDT' } })
        const timeframe = '1d'
        const precio: Precio[] = []
        await new Promise((resolve, reject) => (
            binanceV1.getHistoricalData(data, timeframe, async (error: any, ticks: any[], symbol: any) => {
                ticks.forEach(element => {
                    const [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = element;

                    precio.push({
                        close: close,
                        closetime: closeTime,
                        high: high,
                        low: low,
                        open: open,
                        timeframe: timeframe,
                        volume: volume,
                        opentime: time,
                        moneda: data[0]
                    })
                })
                resolve("resolve")
            })
        ))
        await databaseSQLiteV1Moneda.save<Precio>(precio, Precio)
    }

    async activarLosWorkers() {
        const workerV1 = new WorkerV1()
        const binanceV1 = new BinanceV1()
        const databaseSQLiteV1Moneda = new DatabaseSQLiteV1<Moneda>()
        await databaseSQLiteV1Moneda.openConnection()
        const data = await databaseSQLiteV1Moneda.find(Moneda, { where: { nombre: 'BTCUSDT' } })
        workerV1.startWorkers([{ minute: null }], () => {
            binanceV1.getPrice(data, '4h', (precio: Precio) => {
                // Guardar en bbdd
            })
        })
    }

}
