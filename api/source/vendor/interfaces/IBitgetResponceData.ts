export interface IBitgetResData {
    code: string
    msg: string
    requestTime: number
    data: {
        asks: [string, string][]
        bids: [string, string][]
        ts: string
    }
}