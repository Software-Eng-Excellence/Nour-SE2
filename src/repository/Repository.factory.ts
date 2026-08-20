import config from "../config";
import { ItemCategory } from "../model/IItem";
import { IOrder } from "../model/IOrder";
import { CakeOrderRepository } from "./file/Cake.order.repository";
import { Initializable, IRepository } from "./IRepository";
import { CakeRepository } from "./sqlite/Cake.order.repository";
import { OrderRepository } from "./sqlite/Order.repository";
import { psOrderRepository } from "./psql/order.repository";
import { psCakeOrderRepository } from "./psql/cake.order.repository";
import { psBookOrderRepository } from "./psql/book.order.repository";
import { psToyOrderRepository } from "./psql/toy.order.repository";


export enum DMmode {
    SQLITE,
    FILE,
    POSTGRESQL
}

export class RepositoryFactory {

    public static async create(
        mode: DMmode,
        category: ItemCategory
    ): Promise<IRepository<IOrder>> {

        switch (mode) {
            case DMmode.SQLITE: {
                let repository: IRepository<IOrder> & Initializable;
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
            case DMmode.FILE: {
                switch (category) {
                    case ItemCategory.CAKE:
                        return new CakeOrderRepository(config.storagePath.csv.cake);
                    default:
                        throw new Error("Unsupported category");
                }
            }
            case DMmode.POSTGRESQL: {
                let repository: IRepository<IOrder> & Initializable;

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