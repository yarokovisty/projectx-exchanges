import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Switch, Input, Button} from "@nextui-org/react"
import axios from "axios"
import { useEffect, useState } from "react"

  
export interface IExchangeData {
    exchangeId: string
    pair: string
    price: {
        buy: number
        sell: number
    }
}


export default function App() {
    const [exchangesCount, setExchangesCount] = useState(0)
    const [exchangesData, setData] = useState<IExchangeData | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://google.com")
                // console.log(response)
                setData(response.data)
            } catch (error: any) {
                // setError(error.message)
                console.log(error)
            }
        }

        const interval = setInterval(fetchData, 2000)
    
        return () => clearInterval(interval)
    }, [])

    if (error) return <div>Error: {error}</div>
    if (!exchangesData) return <div>Loading...</div>

    return <section className="space-y-5 mt-2">
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
                        <TableCell className="font-bold">{exchangesData.exchangeId.toUpperCase()}</TableCell>
                        <TableCell className="font-bold">{exchangesData.pair.toUpperCase()}</TableCell>
                        <TableCell className="font-bold">{exchangesData.price.buy}</TableCell>
                        <TableCell className="font-bold">{exchangesData.price.sell}</TableCell>
                        <TableCell className="font-bold">?</TableCell>
                        <TableCell className="font-bold">?</TableCell>
                        <TableCell className="font-bold">Active</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

        </section>
    </section>
}

// export default function App() {
//     const [error, setError] = useState(null)
//     const [data, setData] = useState<IBingixResData | null>(null)

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get('/api/getpairs')
//                 setData(response.data)
//             } catch (error: any) {
//                 setError(error)
//             }
//         }
//         fetchData()
//     }, [])

//     if (error) return <div>Error: {error}</div>
//     if (!data) return <div>Loading...</div>


//     return <section>
//        <pre>{JSON.stringify(data, null, 2)}</pre>

//         
//     </section>
    
// }



