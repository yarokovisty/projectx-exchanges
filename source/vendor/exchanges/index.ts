import { IFetcher } from "../interfaces/IFetcher"

export function GetExchanges(exchanges: Array<IFetcher>): Array<IFetcher> {
    let Exchanges: Array<IFetcher> = [];

    for(let i = 0; i < exchanges.length; i++) { Exchanges.push(exchanges[i]) }

    return Exchanges;
}