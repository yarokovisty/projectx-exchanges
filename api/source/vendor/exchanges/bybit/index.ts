import { CalcURLWithParams } from "../../utils"
import { IBybitResData } from "../../interfaces/IBybitResponceData"
import { TransformPair } from "../../utils"
import { IFetcher } from "../../interfaces/IFetcher"
// https://api.bybit.com/v5/market/instruments-info?category=spot

import dotenv from "dotenv"
dotenv.config({debug: true })

interface MarketPairs {
    retCode: number
    retMsg: string
    result: {
        category: string
        list: ListPairs[]
    }
}

interface ListPairs {
    symbol: string
    baseCoin: string
    quoteCoin: string
    innovation: string
    status: string
    marginTrading: string
    lotSizeFilter: {
        basePrecision: string
        quotePrecision: string
        minOrderQty: string
        maxOrderQty: string
        minOrderAmt: string
        maxOrderAmt: string
    }
    priceFilter: {
        tickSize: string
    }
    riskParameters: {
        limitParameter: string
        marketParameter: string
    }
}

export class BybitFetcher implements IFetcher {
    private BaseURL = process.env.BYBIT_BASEURL as string
    private TypePairSyntaxRequest: number = 0b10
    
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
    
    // private async initialize(_aviablePairs: Record<string, Array<string>>) {
    //     const url = CalcURLWithParams(
    //         this.BaseURL,
    //         "/v5/market/instruments-info",
    //         {category: "spot"}
    //     )

    //     try {
    //         const response = await fetch(url, {
    //             method: "GET",
    //             headers: { "Content-Type": "application/json" },
    //         })

    //         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    //         const apiPairs: MarketPairs[] = (await response.json()) as MarketPairs[]

    //         this.AviablePairs = this.filterPairs(_aviablePairs, apiPairs)
    //         console.log("AviablePairs:", this.AviablePairs)
    //     } catch (error) {
    //         console.error("Error fetching markets:", error)
    //     }
    // }

    // private filterPairs(
    //     availablePairs: Record<string, Array<string>>,
    //     apiPairs: MarketPairs[]
    // ): Record<string, Array<string>> {
    //     const result: Record<string, Array<string>> = {}
    
    //     for (const [key, pairs] of Object.entries(availablePairs)) {
    //         result[key] = pairs.filter((pair) => {
    //             const transformedPair = TransformPair(pair, this.TypePairSyntaxRequest)
    
    //             return apiPairs.some((apiPair) => {
    //                 return apiPair.result.list.some((symbolInfo) => {
    //                     const apiTransformedPair = TransformPair(`${symbolInfo.baseCoin}${symbolInfo.quoteCoin}`, this.TypePairSyntaxRequest)
    //                     return transformedPair === apiTransformedPair
    //                 })
    //             })
    //         })
    //     }
    
    //     return result
    // }


    public async GetLatestPrice(_pair: string): Promise<Record<string, number>> {
        let PriceBidBuy = 0
        let PriceAskSell = 0
        // https://api.bybit.com/v5/market/orderbook?category=spot&limit=5&symbol=BTCUSDT
        const url = CalcURLWithParams(
            this.BaseURL,
            "/v5/market/orderbook",
            {
                category: "spot",
                symbol: _pair
            }
        )

        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const result: IBybitResData = await (response.json() as Promise<IBybitResData>)
    
        PriceAskSell = Number(result.result.a[0][0])
        PriceBidBuy = Number(result.result.b[0][0])

        return {
            buy: PriceBidBuy,
            sell: PriceAskSell
        }
    }

    public GetFetcherPair(pair: string): string {
        return TransformPair(pair, this.TypePairSyntaxRequest)
    }
    
    public get GetTypePairSyntaxRequest(): number {
        return this.TypePairSyntaxRequest
    }
    
}