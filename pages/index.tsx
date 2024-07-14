// Other imports
import axios from "axios"
import { useEffect, useState } from "react"

// Interfaces
import { IExchanges, IPriceData, ISpreadData } from "@/components/interfaces"

// Funtions
import { CalcURLWithParams } from "@/components/functions/CalcURLWithParams"
import { TransformPair } from "@/components/functions/TransformPair"
import { CalcSpreadData } from "@/components/functions/CalcSpreadData"

// Components
import { Pairs } from "@/components/Pairs"
import { Difference } from "@/components/Difference"
import { ExchangesStatus } from "@/components/ExchangesStatus"
import { SettingComponent } from "@/components/Settings"
import { Tabs, Tab } from "@nextui-org/react"

export default function HomePage() {
    const AviablePairs: Record<string, Array<string>> = {
        BTC: ["BTC USDT", "BTC USDC"],
        ETH: ["ETH USDT", "ETH USDC"]
    }

    const [ exchangesData, setExchangeData ] = useState<IPriceData[]>([])
    const [ exchanges, setExchanges ] = useState<IExchanges[]>([])
    const [ spreadInfo, setSpreadInfo ] = useState<ISpreadData[]>([])
    const [ isInited, setIsInited ] = useState(false)


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
    
    useEffect(() => {
        GetExchanges()
    }, [])
    
    useEffect(() => {
        // const settings: ISettings = JSON.parse(
        //     localStorage.getItem("settings") || "{}"
        // ) as ISettings

        // console.log("dipqjhwdiojqwdiojqwoidoi", settings)

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
                    <Pairs exchangesData={ exchangesData }/>
                </Tab>

                <Tab key="PriceDifference" title="Difference">
                    <Difference spreadInfo={ spreadInfo } />
                </Tab>

                <Tab key="ExchangesStatus" title="Status">
                    <ExchangesStatus exchanges={exchanges} />
                </Tab>

                <Tab key="videos" title="Settings">
                    <SettingComponent />
                </Tab>
            </Tabs>
        </section>  
    </section>
}