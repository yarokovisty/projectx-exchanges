import { IFetcher } from "../../interfaces/IFetcher"
import { CalcURLWithParams, TransformPair } from "../../utils"
import { IGarantexResData } from "../../interfaces/IGarantextResponceData"
import dotenv from "dotenv"

dotenv.config({ debug: true })

interface MarketPairs {
    id: string
    name: string
    ask_unit: string
    bid_unit: string
    min_ask: string
    min_bid: string
    maker_fee: string
    taker_fee: string
}

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
        this.name = _name.toLowerCase()

        this.initialize(_aviablePairs)
    }

    private async initialize(_aviablePairs: Record<string, Array<string>>) {
        const url = CalcURLWithParams(this.BaseURL, "/api/v2/markets")

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

            const apiPairs: MarketPairs[] = (await response.json()) as MarketPairs[]

            this.AviablePairs = this.filterPairs(_aviablePairs, apiPairs)
        } catch (error) {
            console.error("Error fetching markets:", error)
        }
    }

    private filterPairs(
        availablePairs: Record<string, Array<string>>,
        apiPairs: MarketPairs[]
    ): Record<string, Array<string>> {
        const result: Record<string, Array<string>> = {}

        for (const [key, pairs] of Object.entries(availablePairs)) {
            result[key] = pairs.filter((pair) => {
                const transformedPair = TransformPair(pair, this.TypePairSyntaxRequest)

                return apiPairs.some((apiPair) => {
                    const apiTransformedPair = TransformPair(apiPair.name, this.TypePairSyntaxRequest)
                    // this fix 
                    return transformedPair === apiTransformedPair
                })
            })
        }

        return result
    }

    public async GetLatestPrice(_pair: string): Promise<Record<string, number>> {
        let PriceBidBuy = 0
        let PriceAskSell = 0

        const url = CalcURLWithParams(this.BaseURL, "/api/v2/depth", { market: _pair })

        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const result: IGarantexResData = (await response.json()) as IGarantexResData

        PriceAskSell = Number(result.asks[0].price)
        PriceBidBuy = Number(result.bids[0].price)

        return {
            buy: PriceBidBuy,
            sell: PriceAskSell,
        }
    }

    public get GetTypePairSyntaxRequest(): number {
        return this.TypePairSyntaxRequest
    }
}