import { Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { ISpreadData } from "./interfaces"

interface IPropsDifference {
    spreadInfo: ISpreadData[]
}

export const Difference: React.FC<IPropsDifference> = ({ spreadInfo }) => {
    return <Table aria-label="TableSpread">
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
                        { spreadData.BuyExchangeId.toUpperCase() }
                        {"-"}
                        { spreadData.SellExchangeId.toUpperCase() }
                    </TableCell>
                    <TableCell className="font-bold text-center">{spreadData.pair.toUpperCase()}</TableCell>
                    <TableCell className="font-bold text-center">{spreadData.minBuy}</TableCell>
                    <TableCell className="font-bold text-center">{spreadData.maxSell}</TableCell>
                    <TableCell className="font-bold text-center">?</TableCell>
                    <TableCell className="font-bold text-center">{spreadData.spread}</TableCell>
                    <TableCell className="font-bold text-center">
                        <Link href="https://binance.com">Тык</Link>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}