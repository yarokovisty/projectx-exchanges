import { IPriceData } from "./interfaces"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

interface IPropsPairs {
    exchangesData: IPriceData[];
    sortData: (key: string) => void;
    sortConfig: { key: string; direction: string };
}

export const Pairs: React.FC<IPropsPairs> = ({ exchangesData, sortData, sortConfig }) => {

    const getSortIcon = (key: string) => {
        if (sortConfig.key !== key) {
            return <FaSort />;
        }
        if (sortConfig.direction === "ascending") {
            return <FaSortUp />;
        }
        return <FaSortDown />;
    };

    return <Table aria-label="TableSpread">
        <TableHeader>
            <TableColumn className="text-lg font-bold" onClick={() => sortData("exchangeId")}>
                Биржа {getSortIcon("exchangeId")}
            </TableColumn>
            <TableColumn className="text-lg font-bold" onClick={() => sortData("pair")}>
                Монеты {getSortIcon("pair")}
            </TableColumn>
            <TableColumn className="text-lg font-bold" onClick={() => sortData("price.buy")}>
                Покупка {getSortIcon("price.buy")}
            </TableColumn>
            <TableColumn className="text-lg font-bold" onClick={() => sortData("price.sell")}>
                Продажа {getSortIcon("price.sell")}
            </TableColumn>
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