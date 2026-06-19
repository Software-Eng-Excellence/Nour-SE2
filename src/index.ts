import { parseCSV, parseJSON, parseXML } from "./util/parser";

import { CSVCakeMapper } from "./mapper/Cake.mapper";
import { JSONBookMapper } from "./mapper/Book.mapper";
import { XMLToyMapper } from "./mapper/Toy.mapper";

import {CSVOrderMapper,JSONOrderMapper,XMLOrderMapper} from "./mapper/Order.mapper";

async function mappingCsv(): Promise<void> {
    const data = await parseCSV("src/data/cake orders.csv");

    const cakeMapper = new CSVCakeMapper();
    const orderMapper = new CSVOrderMapper(cakeMapper);

    const orders = data.map((row: string[]) => orderMapper.map(row));

    console.log(orders);
}

mappingCsv();

async function mappingJson(): Promise<void> {
    const data = await parseJSON("src/data/book orders.json");

    const bookMapper = new JSONBookMapper();
    const orderMapper = new JSONOrderMapper(bookMapper);

    const orders = data.map((order: { [key: string]: string }) => orderMapper.map(order));

    console.log(orders);
}
mappingJson();

async function mappingXml(): Promise<void> {
    const data = await parseXML("src/data/toy orders.xml");

    const toyMapper = new XMLToyMapper();
    const orderMapper = new XMLOrderMapper(toyMapper);

    const orders = data.root.data.row.map((row: { [key: string]: string }) => orderMapper.map(row));

    console.log(orders);
}
mappingXml();
