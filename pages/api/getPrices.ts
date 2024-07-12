import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { exchange, pair } = req.query
        console.log(exchange);
        const { data } = await axios.get(`http://localhost:5144/exchanges/${exchange}/${pair}`);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching data" });
    }
}