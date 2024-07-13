import { IPriceData, ISpreadData } from "../interfaces"

export function CalcSpreadData(data: IPriceData[]): ISpreadData[] {
    if (!data || data.length === 0) return []

    const pairsMap: Map<string, IPriceData[]> = new Map()
    data.forEach(priceData => {
        const pairKey = priceData.pair
        if (!pairsMap.has(pairKey)) pairsMap.set(pairKey, [])

        pairsMap.get(pairKey)!.push(priceData)
    })

    const spreads: ISpreadData[] = []
    pairsMap.forEach((prices, pair) => {
        if (prices.length < 2) return

        let minBuy = prices[0].price.buy
        let maxSell = prices[0].price.sell
        let BuyExchangeId = prices[0].exchangeId
        let SellExchangeId = prices[0].exchangeId

        prices.forEach((priceData) => {
            if (priceData.price.buy < minBuy) {
                minBuy = priceData.price.buy
                BuyExchangeId = priceData.exchangeId
            }
            if (priceData.price.sell > maxSell) {
                maxSell = priceData.price.sell
                SellExchangeId = priceData.exchangeId
            }
        })

        const spread = ((maxSell - minBuy) / minBuy) * 100

        spreads.push({
            minBuy: minBuy,
            maxSell: maxSell,
            BuyExchangeId: BuyExchangeId,
            SellExchangeId: SellExchangeId,
            spread: spread,
            pair: pair
        })
    })

    return spreads
}
