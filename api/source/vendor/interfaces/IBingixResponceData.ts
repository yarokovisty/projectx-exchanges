// T <int64> System time, unit: millisecond
// asks <array> depth of asks. first element price, second element quantity
// bids <array> Buyer depth. first element price, second element quantity
// asksCoin <array> depth of asks. first element price, second element quantity(coin)
// bidsCoin <array> Buyer depth. first element price, second element quantity(coin)
export interface IBingixResData {
    code: number;
    msg: string;
    data: {
        T: number;
        bids: [string, string][];
        asks: [string, string][];
        bidsCoin: [string, string][];
        asksCoin: [string, string][];
    };
}



// export interface IBingixResData {
//     code: number
//     timestamp: number
//     data: {
//         symbol: string
//         trades: {
//             timestamp: number
//             tradeId: string
//             price: string
//             amount: string
//             type: number
//             volume: string
//         }[]
//     }[]
// }
