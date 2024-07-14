import { IPriceData } from "./interfaces"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

interface IPropsPairs { exchangesData: IPriceData[] }

export const Pairs: React.FC<IPropsPairs> = ({exchangesData}) => {
    return <Table aria-label="TableSpread">
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
}