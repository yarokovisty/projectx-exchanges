export interface IFetcher {
    AviablePairs: Record<string, Array<string>>
    Status: "active" | "inactive"
    name: string
    
    GetLatestPrice(_pair: string): Promise<Record<string, number>>
    GetTypePairSyntaxRequest: number
}