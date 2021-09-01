import { Moneda } from "./database/entities/Moneda";
import { Precio } from "./database/entities/Precio";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs').promises
import NodeBinanceApiV1 from 'node-binance-api';

export interface BinanceCoinListInterfaceV1 {
    symbol: string
    baseAsset: string,
    quoteAsset: string,
}

export class BinanceV1 {

    public async getListCoin(callbackFN: (data: BinanceCoinListInterfaceV1[]) => void) {
        try {
            const data = await fs.readFile("src/database/binance/binanceListCoin.json", 'utf8');
            const dataParsed = JSON.parse(data)
            callbackFN(dataParsed)
        } catch (error) {
            console.warn(error);
        }
    }

    public getHistoricalData(monedas: Moneda[], timeframe: string, callBackFN: (error: any, ticks: any, symbol: any) => void) {
        const binance = new NodeBinanceApiV1()
        monedas.forEach(async (moneda) => {
            binance.candlesticks(moneda, timeframe, async (error: any, ticks: any, symbol: any) => {
                callBackFN(error, ticks, symbol)
            }, { limit: 499 });
        })
    }

    public async getPrice(monedas: Moneda[], timeframe: string, callBackFN: (precio: Precio) => void) {

        const binance = new NodeBinanceApiV1()

        monedas.forEach(async (moneda) => {
            await binance.candlesticks(moneda.nombre, timeframe, (error: any, ticks: any, symbol: any) => {

                if (ticks.length > 0) {
                    const last_tick = ticks[ticks.length - 1];
                    const [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;

                    const precio: Precio = {
                        close: close,
                        closetime: closeTime,
                        high: high,
                        low: low,
                        open: open,
                        timeframe: timeframe,
                        volume: volume,
                        opentime: time,
                        moneda: moneda
                    }
                    callBackFN(precio)
                }
            }, { limit: 2 });
        })
    }


}