export interface ISettings {
    isUpdatingPrices: boolean
    isNotifying: boolean

    updatePeriod: number
    minSpreadByNotify: number
}

export interface IExchanges {
    name: string
    status: string
    typeSyntax: number
}

export interface IPriceData {
    exchangeId: string
    pair: string
    price: {
        buy: number
        sell: number
    }
}

export interface ISpreadData {
    pair: string
    minBuy: number
    maxSell: number
    BuyExchangeId: string
    SellExchangeId: string
    spread: number
}