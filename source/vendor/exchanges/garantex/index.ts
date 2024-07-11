// https://garantex.org/api/v2/depth
// https://garantex.org/api/v2/depth?market=btcusdt

import { IFetcher } from "../../interfaces/IFetcher"
import { CalcURLWithParams, TransformPair } from "../../utils"
import { IGarantexResData } from "../../interfaces/IGarantextResponceData"
import dotenv from "dotenv"
// Цена бид (Buy) – это цена спроса или максимальная цена, по которой покупатель согласен купить товар. Покупатель не хочет покупать дорого. Это логика закона спроса и предложения.
// Цена аск – это цена предложения или наименьшая цена, по которой продавец согласен продать товар. Продавец не хочет продавать дешево.
dotenv.config({debug: true })

export class GarantexFetcher implements IFetcher {
    private BaseURL = process.env.GARANTEX_BASEURL as string
    private TypePairSyntaxRequest: number = 0b00
    
    public AviablePairs: Record<string, Array<string>> = {}
    public Status: "active" | "inactive"
    public name: string

    constructor(
        _aviablePairs: Record<string, Array<string>>,
        _status: "active" | "inactive" = "active",
        _name: string
    ) {
        this.Status = _status
        this.name = _name.toLocaleLowerCase()

        for (const key in _aviablePairs) {
            if (_aviablePairs.hasOwnProperty(key)) {
                this.AviablePairs[key] = _aviablePairs[key].map(
                    pair => TransformPair(pair, this.TypePairSyntaxRequest)
                )
            }
        }
    }


    public async GetLatestPrice(_pair: string): Promise<Record<string, number>> {
        let PriceBidBuy = 0
        let PriceAskSell = 0

        const url = CalcURLWithParams(
            this.BaseURL,
            "/api/v2/depth",
            { market: _pair }
        )
         
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const result: IGarantexResData = await (response.json() as Promise<IGarantexResData>)
        
        PriceAskSell = Number(result.asks[0].price)
        PriceBidBuy = Number(result.bids[0].price)

        return {
            buy: PriceBidBuy,
            sell: PriceAskSell
        }
    }

    public get GetTypePairSyntaxRequest(): number {
        return this.TypePairSyntaxRequest
    }
}