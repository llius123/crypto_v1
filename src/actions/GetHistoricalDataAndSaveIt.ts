import NodeBinanceApiV1 from 'node-binance-api';
import { Moneda } from '../database/entities/Moneda';
import { Precio } from '../database/entities/Precio';
import { DatabaseSQLiteV1 } from '../DatabaseSQLiteV1';

export class GetHistoricalDataAndSaveIt {
    run(moneda: string, timeframe: string): void {
        const binance = new NodeBinanceApiV1()
        binance.candlesticks(moneda, timeframe, async (error: any, ticks: any[], symbol: any) => {
            const precios: Precio[] = await this.createPrecios(ticks, moneda, timeframe)
            this.savePreciosOnDatabase(precios)
            console.info(moneda + " en " + timeframe + " guardado.");
        }, { limit: 499 });
    }

    private async savePreciosOnDatabase(precios: Precio[]): Promise<void> {
        const database = new DatabaseSQLiteV1()
        await database.openConnection()
        const connection = database.connection
        const precioRepository = connection.getRepository(Precio)
        await precioRepository.save(precios)
        await database.closeConnection()
    }

    private async createPrecios(ticks: any, monedaNombre: string, timeframe: string): Promise<Precio[]> {

        const database = new DatabaseSQLiteV1()
        await database.openConnection()
        const connection = database.connection
        const monedaRepository = connection.getRepository(Moneda)
        let moneda = await monedaRepository.findOne({ where: { nombre: monedaNombre } })

        if (!moneda) {
            await monedaRepository.save({ nombre: monedaNombre })
            moneda = await monedaRepository.findOne({ where: { nombre: monedaNombre } })
            await database.closeConnection()
        }


        const precios: Precio[] = []

        ticks.forEach((tick: any) => {
            const [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = tick;
            precios.push({
                close: close,
                closetime: closeTime,
                high: high,
                low: low,
                open: open,
                timeframe: timeframe,
                volume: volume,
                opentime: time,
                moneda: moneda
            })
        })

        return precios

    }
}