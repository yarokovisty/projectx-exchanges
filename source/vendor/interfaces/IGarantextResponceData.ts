export interface IGarantexResData {
    timestamp: number
    asks: {
        price: string
        volume: string
        factor: string
        amount: string
        type: string
    }[]

    bids: {
        price: string
        volume: string
        factor: string
        amount: string
        type: string
    }[]
}