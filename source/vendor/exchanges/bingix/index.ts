// [============> Importing <============]
import { CalcURLWithParams } from "../../utils"
import { IBingixResData } from "../../interfaces/IBingixResponceData"
import { TransformPair } from "../../utils"
import { IFetcher } from "../../interfaces/IFetcher"


import dotenv from "dotenv"
dotenv.config({debug: true })

// [============> Realization <============]
export class BingixFetcher implements IFetcher {
    private BaseURL = process.env.BINGIX_BASEURL as string
    private TypePairSyntaxRequest: number = 0b11
    
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
    
    /**
     * Fetches the latest price for a given pair from the Bingix API.
     *
     * @param _pair - The pair for which to fetch the latest price.
     * @returns A Promise that resolves to the latest price of the given pair.
     * @throws Will throw an error if the HTTP request fails or if the response data is invalid.
     *
     * //     this.BaseURL,
        //     "/openApi/spot/v1/ticker/price",
        //     { symbol: _pair }
        // )
     * 
     * @remarks
     * This method constructs a URL using the provided base URL, path, and parameters,
     * then makes a GET request to the constructed URL. If the request is successful,
     * it parses the JSON response and extracts the latest price from the data.
     * If the request fails or the response data is invalid, it throws an error.
    */
    public async GetLatestPrice(_pair: string): Promise<Record<string, number>> {
        const timestamp = new Date().getTime()
        let PriceBidBuy = 0
        let PriceAskSell = 0
        
        const url = CalcURLWithParams(
            this.BaseURL,
            "/openApi/swap/v2/quote/depth",
            { symbol: _pair }
        )

        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const result: IBingixResData = await (response.json() as Promise<IBingixResData>)
        // price = Number(result.data[0].trades[0].price)
    
        PriceAskSell = Number(result.data.asks[0][0])
        PriceBidBuy = Number(result.data.bids[0][0])

        return {
            buy: PriceBidBuy,
            sell: PriceAskSell
        }
    }
    
    public get GetTypePairSyntaxRequest(): number {
        return this.TypePairSyntaxRequest
    }
    
}