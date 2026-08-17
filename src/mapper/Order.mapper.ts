import { IIdentifiableOrderItem, IOrder } from "../model/IOrder";
import { IMapper } from "./IMapper";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "../model/builders/order.builder";
import { IIdentifiableItem, IItem } from "../model/IItem";


export class CSVOrderMapper implements IMapper<string[], IOrder> {
    constructor(private itemMapper: IMapper<string[], IItem>) {
    }
    map(data: string[]): IOrder {
        const item:IItem=this.itemMapper.map(data);
        return OrderBuilder.newBuilder()
                        .setId(data[0])
                        .setQuantity(parseInt(data[data.length-1]))
                        .setPrice(parseInt(data[data.length-2]))
                        .setItem(item)
                        .build();
        }

    reverseMap(data: IOrder): string[] {
        const item = this.itemMapper.reverseMap(data.getItem());
        return[
            data.getID(),
            ...item,
            data.getPrice().toString(),
            data.getQuantity().toString()
        ]
    }
}

export class JSONOrderMapper implements IMapper<{ [key: string]: string }, IOrder> {
    constructor(private itemMapper: IMapper<{ [key: string]: string }, IItem>) { }

    map(data: { [key: string]: string }): IOrder {
        const item = this.itemMapper.map(data);
        
        return OrderBuilder.newBuilder()
            .setId(data["Order ID"])
            .setPrice(parseInt(data["Price"]))
            .setQuantity(parseInt(data["Quantity"]))
            .setItem(item)
            .build();
    }
    reverseMap(data: IOrder): { [key: string]: string } {

        const itemData = this.itemMapper.reverseMap(data.getItem());

        return {
            "Order ID": data.getID(),
            ...itemData,
            "Price": data.getPrice().toString(),
            "Quantity": data.getQuantity().toString()
        };
    }
}

export class XMLOrderMapper implements IMapper<{ [key: string]: string }, IOrder> {
    constructor(private itemMapper: IMapper<{ [key: string]: string }, IItem>) { }

    map(data: { [key: string]: string }): IOrder {
        const item = this.itemMapper.map(data);

        return OrderBuilder.newBuilder()
            .setId(data["OrderID"])
            .setPrice(parseInt(data["Price"]))
            .setQuantity(parseInt(data["Quantity"]))
            .setItem(item)
            .build();
    }
    reverseMap(data: IOrder): { [key: string]: string } {

        const itemData = this.itemMapper.reverseMap(data.getItem());

        return {
            "OrderID": data.getID(),
            ...itemData,
            "Price": data.getPrice().toString(),
            "Quantity": data.getQuantity().toString()
        };
    }
}

export interface SQLieteOrder{
    id:string;
    quantity:number;
    price:number;
    item_category:string;
    item_id:string;
}
export class SQLiteOrderMapper implements IMapper<{data: SQLieteOrder, item: IIdentifiableItem}, IIdentifiableOrderItem> {
    map({data , item}: {data: SQLieteOrder, item: IIdentifiableItem}): IIdentifiableOrderItem {
        const order= OrderBuilder.newBuilder()
                        .setId(data.id)
                        .setPrice(data.price)
                        .setQuantity(data.quantity)
                        .setItem(item)
                        .build();
        return IdentifiableOrderItemBuilder.newBuilder().setOrder(order).setItem(item).build();
    }

    reverseMap(d: IIdentifiableOrderItem):  {data: SQLieteOrder, item: IIdentifiableItem} {
        return {
            data: {
                id: d.getID(),
                quantity: d.getQuantity(),
                price: d.getPrice(),
                item_category: d.getItem().getCategory(),
                item_id: d.getItem().getID()
            },
            item: d.getItem()
        }
    }    
}
// psql
export interface psOrder {
    id: string;
    quantity: number;
    price: number;
    item_category: string;
    item_id: string;
}

export class PSQLOrderMapper implements IMapper<{ data: psOrder, item: IIdentifiableItem }, IIdentifiableOrderItem> {
    map({ data, item }: { data: psOrder; item: IIdentifiableItem; }): IIdentifiableOrderItem {
        return IdentifiableOrderItemBuilder
            .newBuilder()
            .setOrder(OrderBuilder.newBuilder()
                    .setId(data.id)
                    .setPrice(data.price)
                    .setQuantity(data.quantity)
                    .setItem(item)
                    .build())
            .setItem(item)
            .build();
    }

    reverseMap(data: IIdentifiableOrderItem): { data: psOrder; item: IIdentifiableItem; } {
        throw new Error("Method not implemented.");
    }
}
