export interface IBybitResData {
    retCode: number
    retMsg: string
    result: {
        s: string
        a: [string, string][]
        b: [string, string][]
        ts: number
        u: number
        seq: number
        cts: number
    }
    retExtInfo: Record<string, unknown>
    time: number
}