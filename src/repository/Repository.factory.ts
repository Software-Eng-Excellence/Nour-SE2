import config from "../config";
import { ItemCategory } from "../model/IItem";
import { IIdentifiableOrderItem, IOrder } from "../model/IOrder";
import { CakeOrderRepository } from "./file/Cake.order.repository";
import { Initializable, IRepository } from "./IRepository";
import { CakeRepository } from "./sqlite/Cake.order.repository";
import { OrderRepository } from "./sqlite/Order.repository";
import { psOrderRepository } from "./psql/order.repository";
import { psCakeOrderRepository } from "./psql/cake.order.repository";
import { psBookOrderRepository } from "./psql/book.order.repository";
import { psToyOrderRepository } from "./psql/toy.order.repository";
import { DBMode } from "../config/types";

export class RepositoryFactory {

    public static async create(mode: DBMode,category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {

        switch (mode) {
            case DBMode.SQLITE: {
                let repository: IRepository<IIdentifiableOrderItem> & Initializable;
                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new OrderRepository(new CakeRepository());
                        break;

                    default:
                        throw new Error("Unsupported category");
                }
                await repository.init();
                return repository;
            }
            // Deprecated
            case DBMode.FILE: {
                throw new Error("File mode is deprecated")
            }

            case DBMode.POSTGRESQL: {
                switch (category) {
                    case ItemCategory.CAKE:
                        return new psOrderRepository(new psCakeOrderRepository());

                    case ItemCategory.BOOK:
                        return new psOrderRepository(new psBookOrderRepository());

                    case ItemCategory.TOY:
                        return new psOrderRepository(new psToyOrderRepository());

                    default:
                        throw new Error("Unsupported category");
                }
            }
        }
    }
}