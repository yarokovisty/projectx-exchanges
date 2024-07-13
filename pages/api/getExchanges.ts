import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

interface IExchanges {
    [key: string]: {
        status: "active" | "inactive"
        pairs: {
            [key: string]: Array<string>
        }
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { data } : { data: IExchanges } = await axios.get("http://localhost:5144/exchanges/get")

        const exchangesWithStatus = Object.entries(data).map(([name, exchange]) => ({
            name,
            status: exchange.status,
        }))

        res.status(200).json(exchangesWithStatus)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error fetching data" })
    }
}