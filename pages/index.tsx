import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Switch, Input, Button} from "@nextui-org/react"
import axios from "axios"
import { useEffect, useState } from "react"
import {Tabs, Tab, Card, CardBody, CardHeader} from "@nextui-org/react"
  
export interface IPriceData {
    exchangeId: string
    pair: string
    price: {
        buy: number
        sell: number
    }
}

interface IExchanges {
    name: string
    status: string
}

export function CalcURLWithParams(
    baseURL: string,
    path: string,
    params?: Record<string, string>
): string {
    const keys = params ? Object.keys(params) : []
    let url = baseURL + path

    if (keys.length > 0) {
        url += "?"
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            if (params) {
                const value = encodeURIComponent(params[key])
                url += `${key}=${value}`
            }

            if (i < keys.length - 1) {
                url += "&"
            }
        }
    }

    return url
}

export const TransformPair = (pair: string, flags: number): string => {
    const normalizedPair = pair.replace(/[\s\/-]/g, '').toLowerCase()
    
    const part1 = normalizedPair.slice(0, normalizedPair.length / 2)
    const part2 = normalizedPair.slice(normalizedPair.length / 2)

    const useLowerCase = (flags & 0b10) === 0
    const useDash = (flags & 0b01) !== 0

    let result = useDash ? `${part1}-${part2}` : `${part1}${part2}`
    result = useLowerCase ? result.toLowerCase() : result.toUpperCase()

    return result
}






export default function App() {
    const [exchanges, setExchanges] = useState<IExchanges[]>([])
    const [isInited, setIsInited] = useState(false)
    const AviablePairs: Record<string, Array<string>> = {
        BTC: ["BTC USDT", "BTC USDC"],
        ETH: ["ETH USDT", "ETH USDC"]
    }
    
    useEffect(() => {
        const getExchanges = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/getExchanges")
                setExchanges(response.data)
                setIsInited(true)
            } catch (error) {
                console.error('Error fetching exchanges data:', error)
            }
        }
    
        getExchanges()
    }, [])
    
    useEffect(() => {
        const getPrices = async () => {
            if (!isInited || exchanges.length === 0) return

            try {
                const promises = exchanges.flatMap((exchange) =>
                    Object.entries(AviablePairs).flatMap(([_, pairs]) =>
                        pairs.map(async (pair) => {
                            try {
                                // const url = CalcURLWithParams(pair.url, pairOptions)
                                const response = await axios.get(`http://localhost:3000/api/getPrices`, {
                                    params: { exchange: exchange.name, pair }
                                })

                                console.log(response.data)
                            } catch (error) {
                                console.error(`Error fetching price for ${exchange.name} and ${pair}:`, error)
                            }
                        })
                    )
                )
                await Promise.all(promises)
            } catch (error) {
                console.error('Error fetching prices data:', error)
            }
        }

        const intervalId = setInterval(getPrices, 5000)

        getPrices()

        return () => clearInterval(intervalId)
    }, [isInited, exchanges])

    
    return <section className="space-y-5 mt-2">
        <div className="flex w-full flex-col">
            <Tabs color="danger" size="lg" aria-label="Options">
                <Tab key="Pairs" title="Pairs">
                    <Card>
                        <CardBody>
                            <section className="w-2/3 mx-auto">
                                <Table aria-label="TableSpread">
                                    <TableHeader>
                                        <TableColumn className="text-lg font-bold">Биржа</TableColumn>
                                        <TableColumn className="text-lg font-bold">Монеты</TableColumn>
                                        <TableColumn className="text-lg font-bold">Покупка</TableColumn>
                                        <TableColumn className="text-lg font-bold">Продажа</TableColumn>
                                        <TableColumn className="text-lg font-bold">Комиссии</TableColumn>
                                        <TableColumn className="text-lg font-bold">Доход</TableColumn>
                                        <TableColumn className="text-lg font-bold">Статус</TableColumn>
                                    </TableHeader>

                                    <TableBody emptyContent={"Нет информации о спреде"}>
                                        <TableRow key="1">
                                            {/* <TableCell className="font-bold">{exchangesData.exchangeId.toUpperCase()}</TableCell> */}
                                            {/* <TableCell className="font-bold">{exchangesData.pair.toUpperCase()}</TableCell> */}
                                            {/* <TableCell className="font-bold">{exchangesData.price.buy}</TableCell> */}
                                            {/* <TableCell className="font-bold">{exchangesData.price.sell}</TableCell> */}
                                            <TableCell className="font-bold">?</TableCell>
                                            <TableCell className="font-bold">?</TableCell>
                                            <TableCell className="font-bold">?</TableCell>
                                            <TableCell className="font-bold">?</TableCell>
                                            <TableCell className="font-bold">?</TableCell>
                                            <TableCell className="font-bold">?</TableCell>
                                            <TableCell className="font-bold">Active</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </section>
                        </CardBody>
                    </Card>  
                </Tab>

                <Tab key="ExchangesStatus" title="Status">
                    <Card>
                        <CardBody>
                            <section className="flex justify-around">
                                {exchanges.map((exchange, index) => (
                                    <Card className="w-fit">
                                        <CardHeader className="space-x-2" key={index}>
                                            <h1 className="text-2xl font-bold">{exchange.name.toUpperCase()}</h1>
                                            <span className={` ${exchange.status == "active" ? "bg-green-600" : "bg-red-600" } rounded-full animate-pulse w-3 h-3`}></span>
                                        </CardHeader>
                                        <CardBody>
                                            <p className="font-bold">Status: {exchange.status}</p>
                                        </CardBody>
                                    </Card>
                                ))}
                            </section>
                        </CardBody>
                    </Card>  
                </Tab>

                <Tab key="videos" title="Settings">
                    <Card>
                        <CardBody>
                            <section className="space-y-2 w-2/3 mx-auto">
                                <section className="flex space-x-2 w-fit">
                                    <h1>Уведомления в Telegram</h1>
                                    <Switch defaultSelected />
                                </section>

                                <section className="flex space-x-2 w-fit">
                                    <h1>Обновление</h1>
                                    <Input placeholder="Переодичность (сек)" size="sm" />
                                </section>

                                <section className="flex space-x-2 w-fit">
                                    <h1>Спред</h1>
                                    <Switch defaultSelected />
                                    <Input placeholder="Переодичность (сек)" size="sm" />
                                </section>

                                <Button color="primary">Сохранить</Button>
                            </section>
                        </CardBody>
                    </Card>  
                </Tab>
            </Tabs>
        </div>  
    </section>
}











// useEffect(() => {
//     let isInited = false


//     

//     if (!isInited) {
//       getExchanges().then(() => {
//         getPrices()
//         isInited = true
//       })
//     } else {
//       getPrices()
//     }

//     const intervalId = setInterval(() => {
//       getPrices()
//     }, 60000) // 60000 ms = 1 min

//     return () => clearInterval(intervalId)
//   }, [exchanges])