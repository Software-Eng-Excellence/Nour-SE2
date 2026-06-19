import { ID } from "../repository/IRepository";
import {  IItem } from "./IItem";

export interface IOrder{
    getItem(): IItem;
    getPrice(): number;
    getQuantity(): number;
    getID(): string;
}

export interface IIdentifiableOrderItem extends IOrder, ID {
    getItem(): IIdentifiableItem;
}