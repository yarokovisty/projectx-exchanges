import dotenv from "dotenv"
import Fastify, { FastifyRequest, FastifyReply } from "fastify"

import { GetExchanges } from "./vendor/exchanges"
import { BingixFetcher } from "./vendor/exchanges/bingix"
import { GarantexFetcher } from "./vendor/exchanges/garantex"
import { TransformPair } from "./vendor/utils"

const fastify = Fastify({ logger: true })
dotenv.config({ debug: true })

const AviablePairs: Record<string, Array<string>> = {
    BTC: ["BTC USDT", "BTC USDC"],
    ETH: ["ETH USDT", "ETH USDC"]
}

const Exchanges = GetExchanges([
    new BingixFetcher(AviablePairs, "active", "Bingix"),
    new GarantexFetcher(AviablePairs, "active", "Garantex")
])


fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { hello: "Work!!!" }
})

fastify.get("/exchanges/get", async (request: FastifyRequest, reply: FastifyReply) => {
    let data: Record<string, any> = {}

    for(let i = 0; i < Exchanges.length; i++) {
        data[Exchanges[i].name] = {
            status: Exchanges[i].Status,
            pairs: Exchanges[i].AviablePairs
        }
    }

    return data
})

// 1. Bybit
// 3.Bitget
// 5. HTX (Huobi)

fastify.get("/exchanges/:exchangeId/:pair", async (
    request: FastifyRequest<{
        Params: { exchangeId: string, pair: string } 
    }>,
    reply: FastifyReply
) => {
    const _exchangeId: string = request.params.exchangeId;
    const _pair: string = request.params.pair

    let _found = false;
    let _positionExchange = 255;

    for (let i = 0; i < Exchanges.length; i++) {
        if (_exchangeId === Exchanges[i].name) {
            _found = true
            _positionExchange = i
            break
        }
    }
    if (!_found) return reply.send({ message: "Exchange not found!" })

    const exchangeObject = Exchanges[Exchanges.findIndex(exchange => exchange.name === _exchangeId)]
    const prices = await exchangeObject.GetLatestPrice(
        TransformPair(_pair, exchangeObject.GetTypePairSyntaxRequest)
    )

    return reply.send({
        exchangeId: _exchangeId,
        pair: _pair,
        price: prices
    });
});

fastify.listen({port: 3000, host: "0.0.0.0"}, (err, address) => {
    if (err) throw err
    console.log(`Server listening on ${address}`)
})