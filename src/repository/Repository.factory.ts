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
import { DBMode } from "../model/DBModes.model";

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
                let repository: IRepository<IIdentifiableOrderItem> & Initializable;

                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new psOrderRepository(new psCakeOrderRepository());
                        break;
                    case ItemCategory.BOOK:
                        repository = new psOrderRepository(new psBookOrderRepository());
                        break;
                    case ItemCategory.TOY:
                        repository = new psOrderRepository(new psToyOrderRepository());
                        break;
                    default:
                        throw new Error("Unsupported category");
                }
                await repository.init();
                return repository;
            }
            default:
                throw new Error("Unsupported DB mode");
        }
    }
}