import axios from "axios"
import { useEffect, useState } from "react"

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Link } from "@nextui-org/react"
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react"
import { motion } from "framer-motion"

import { SettingComponent } from "@/components/settings"
import { CalcURLWithParams } from "@/components/functions/CalcURLWithParams"
import { TransformPair } from "@/components/functions/TransformPair"
import { ISettings, IExchanges, IPriceData, ISpreadData } from "@/components/interfaces"
import { CalcSpreadData } from "@/components/functions/CalcSpreadData"

export default function HomePage() {
    // Pair data
    const AviablePairs: Record<string, Array<string>> = {
        BTC: ["BTC USDT", "BTC USDC"],
        ETH: ["ETH USDT", "ETH USDC"]
    }

    // Exchanges data, price and state
    const [ exchangesData, setExchangeData ] = useState<IPriceData[]>([])
    const [ exchanges, setExchanges ] = useState<IExchanges[]>([])
    const [ spreadInfo, setSpreadInfo ] = useState<ISpreadData[]>([])
    const [ isInited, setIsInited ] = useState(false)


    // Internal functions
    async function GetExchanges() {
        try {
            const response = await axios.get("http://localhost:3000/api/getExchanges")
            setExchanges(response.data)
            setIsInited(true)
        } catch (error) {
            console.error('Error fetching exchanges data:', error)
        }
    }

    async function GetPrices() {
        if (!isInited || exchanges.length === 0) return

        try {
            const promises = exchanges.flatMap((exchange) =>
                Object.entries(AviablePairs).flatMap(([_, pairs]) =>
                    pairs.map(async (pair) => {
                        try {
                            const url = CalcURLWithParams(
                                "http://localhost:3000",
                                "/api/getPrices",
                                {
                                    exchange: exchange.name,
                                    pair: TransformPair(pair, exchange.typeSyntax)
                                }
                            )
                            const response: IPriceData = (await axios.get(url)).data
                            const newPriceData: IPriceData = response
                            setExchangeData(prevData => {
                                const existingIndex = prevData.findIndex(
                                    data => data.exchangeId === newPriceData.exchangeId && data.pair === newPriceData.pair
                                )

                                if (existingIndex !== -1) {
                                    const updatedData = [...prevData]
                                    updatedData[existingIndex] = newPriceData
                                    return updatedData
                                } else return [...prevData, newPriceData]
                            })
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
    
    // Calling functions on the client
    useEffect(() => {
        GetExchanges()
    }, [])
    
    useEffect(() => {
        const settings: ISettings = JSON.parse(
            localStorage.getItem("settings") || "{}"
        ) as ISettings

        console.log(settings)

        const intervalId = setInterval(GetPrices, 5000)

        return () => clearInterval(intervalId)
    }, [isInited, exchanges])

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (exchangesData && exchangesData.length > 0) {
                const spreads = CalcSpreadData(exchangesData)
                console.log(spreads)
                setSpreadInfo(spreads)
            } else {
                console.log('No price data available yet.')
            }
        }, 500)

        return () => clearInterval(intervalId)
    }, [exchangesData])

    return <section className="space-y-5 mt-2">
        <section className="flex items-center flex-col">
            <Tabs color="danger" size="lg" aria-label="Options">
                <Tab key="Pairs" title="Pairs">
                    <Table aria-label="TableSpread">
                        <TableHeader>
                            <TableColumn className="text-lg font-bold">Биржа</TableColumn>
                            <TableColumn className="text-lg font-bold">Монеты</TableColumn>
                            <TableColumn className="text-lg font-bold">Покупка</TableColumn>
                            <TableColumn className="text-lg font-bold">Продажа</TableColumn>
                            <TableColumn className="text-lg font-bold">Комиссии</TableColumn>
                            <TableColumn className="text-lg font-bold">Статус</TableColumn>
                        </TableHeader>
                        
                        <TableBody emptyContent={"Нет информации о спреде"}>
                            {exchangesData.map((exchangeData, index) => (
                                    <TableRow key={index}>
                                            <TableCell className="font-bold">{exchangeData.exchangeId.toUpperCase()}</TableCell>
                                            <TableCell className="font-bold">{exchangeData.pair.toUpperCase()}</TableCell>
                                            <TableCell className="font-bold">{exchangeData.price.buy}</TableCell>
                                            <TableCell className="font-bold">{exchangeData.price.sell}</TableCell>
                                            <TableCell className="font-bold">?</TableCell>
                                            <TableCell className="font-bold">Active</TableCell>
                                    </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Tab>

                <Tab key="PriceDifference" title="Difference">
                    <Table aria-label="TableSpread">
                        <TableHeader>
                            <TableColumn className="text-lg font-bold">Направление</TableColumn>
                            <TableColumn className="text-lg font-bold">Пара</TableColumn>
                            <TableColumn className="text-lg font-bold">Покупка</TableColumn>
                            <TableColumn className="text-lg font-bold">Продажа</TableColumn>
                            <TableColumn className="text-lg font-bold">Общая комиссия</TableColumn>
                            <TableColumn className="text-lg font-bold">Разница</TableColumn>
                            <TableColumn className="text-lg font-bold">Ссылка</TableColumn>
                        </TableHeader>
                        
                        <TableBody emptyContent={"Нет информации о спреде"}>
                            {spreadInfo.map((spreadData, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-bold text-center">
                                        {spreadData.BuyExchangeId}
                                        {"-"}
                                        {spreadData.SellExchangeId}
                                    </TableCell>
                                    <TableCell className="font-bold text-center">{spreadData.pair}</TableCell>
                                    <TableCell className="font-bold text-center">{spreadData.minBuy}</TableCell>
                                    <TableCell className="font-bold text-center">{spreadData.maxSell}</TableCell>
                                    <TableCell className="font-bold text-center">?</TableCell>
                                    <TableCell className="font-bold text-center">{spreadData.spread}</TableCell>
                                    <TableCell className="font-bold text-center"><Link href="https://binance.com">Тык</Link></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Tab>

                <Tab key="ExchangesStatus" title="Status">
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
                </Tab>

                <Tab key="videos" title="Settings">
                    <SettingComponent />
                </Tab>
            </Tabs>
        </section>  
    </section>
}