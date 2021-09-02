import { WorkerV1 } from './WorkerV1';
import { Moneda } from "./database/entities/Moneda";
import { Precio } from "./database/entities/Precio";
import { BinanceV1 } from "./BinanceV1";
import { DatabaseSQLiteV1 } from "./DatabaseSQLiteV1";

import express, { Request, Response } from 'express';
import { GetHistoricalDataAndSaveIt } from './actions/GetHistoricalDataAndSaveIt';
import { StartWorker } from './actions/StartWorker';
const app = express()
const port = 3000

// http://localhost:3000/getHistoricalDataAndSaveIt?moneda=BTCUSDT&timeframe=4h
// http://localhost:3000/startWorker4h?moneda=BTCUSDT&timeframe=4h

app.get('/getHistoricalDataAndSaveIt', async (req: Request, res: Response) => {
    const { moneda, timeframe } = req.query as { moneda: string, timeframe: string };
    if (moneda && timeframe) {
        const getHistoricalDataAndSaveIt = new GetHistoricalDataAndSaveIt()
        getHistoricalDataAndSaveIt.run(moneda, timeframe)
    }
    res.send({ url: '/getHistoricalDataAndSaveIt' })
})

app.get('/startWorker4h', async (req: Request, res: Response) => {
    const { moneda, timeframe } = req.query as { moneda: string, timeframe: string };

    const times = [
        { hour: 2, minute: 5 },
        { hour: 6, minute: 5 },
        { hour: 10, minute: 5 },
        { hour: 14, minute: 5 },
        { hour: 18, minute: 5 },
        { hour: 22, minute: 5 },
    ];

    if (moneda && timeframe) {
        const worker = new StartWorker()
        worker.run(times, moneda, timeframe)
    }

    res.send({ url: '/startWorker4h' })

})




// app.get('/startWorker4h', async (req: any, res: any) => {


//     const times = [
//         { hour: 2, minute: 5 },
//         { hour: 6, minute: 5 },
//         { hour: 10, minute: 5 },
//         { hour: 14, minute: 5 },
//         { hour: 18, minute: 5 },
//         { hour: 22, minute: 5 },
//     ];

//     const workerV1 = new WorkerV1()
//     const binanceV1 = new BinanceV1()
//     const databaseSQLiteV1Moneda = new DatabaseSQLiteV1<Moneda>()
//     await databaseSQLiteV1Moneda.openConnection()
//     const data = await databaseSQLiteV1Moneda.find(Moneda, { where: { nombre: 'BTCUSDT' } })
//     workerV1.startWorkers(times, () => {
//         binanceV1.getPrice(data, '4h', (precio: Precio) => {
//             databaseSQLiteV1Moneda.save([precio], Precio)
//             console.log("Dato guardado");
//         })
//     })


//     res.send({ url: '/startWorker4h' })
// })


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
                console.log(precio);

            })
        })
    }

}
