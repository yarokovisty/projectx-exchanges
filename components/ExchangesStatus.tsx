import { IExchanges } from "./interfaces"
import { Card, CardBody, CardHeader } from "@nextui-org/react"

interface IPropsExchangesStatus {
    exchanges: IExchanges[]
}

export const ExchangesStatus: React.FC<IPropsExchangesStatus> = ({ exchanges }) => {
    return <section className="flex justify-around">
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
}