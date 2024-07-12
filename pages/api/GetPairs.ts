import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { data } = await axios.get("http://66.151.40.231:5144/exchanges/bingix/btcusdt");
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching data" });
    }
}