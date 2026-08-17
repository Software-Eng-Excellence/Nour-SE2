import { IIdentifiableOrderItem } from "../../model/IOrder";
import { id, Initializable, IRepository } from "../IRepository";
import logger from "../../util/logger";
import {DbException,InitializationException} from "../../util/exceptions/ItemNotFoundException";
import { IIdentifiableItem } from "../../model/IItem";
import ConnectionManager from "./ConnectionManager";
import {SQLieteOrder,SQLiteOrderMapper} from "../../mapper/Order.mapper";

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS "order" (
                    id TEXT PRIMARY KEY,
                    quantity INTEGER NOT NULL,
                    price INTEGER NOT NULL,
                    item_category INTEGER NOT NULL,
                    item_id TEXT NOT NULL
                )`;

const INSERT_ORDER = ` INSERT INTO "order" (id, quantity, price, item_category, item_id) VALUES (?, ?, ?, ?, ?)`;

const SELECT_BY_ID = ` SELECT * FROM "order" WHERE id = ?`;

const SELECT_ALL = ` SELECT * FROM "order" WHERE item_category = ?`;

const DELETE_ID = ` DELETE FROM "order" WHERE id = ?`;

const UPDATE_ID = ` UPDATE "order" SET quantity = ?, price = ?, item_category = ?, item_id = ? WHERE id = ?`;

export class OrderRepository implements IRepository<IIdentifiableOrderItem>, Initializable {
    constructor( private readonly itemRepository: IRepository<IIdentifiableItem> & Initializable) {}

    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            await this.itemRepository.init();
            logger.info("Order table initialized.");
        } catch (error: unknown) {
            logger.error(
                "Failed to initialize Order table",
                error as Error
            );
            throw new InitializationException(
                "Failed to initialize Order table",
                error as Error
            );
        }
    }
    async create(order: IIdentifiableOrderItem): Promise<id> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            await conn.exec("BEGIN TRANSACTION");
            const item_id = await this.itemRepository.create(order.getItem());

            await conn.run(INSERT_ORDER,[ order.getID(), order.getQuantity(), order.getPrice(), order.getItem().getCategory(), item_id ]);
            await conn.exec("COMMIT");
            return order.getID();

        } catch (error: unknown) {
            logger.error("Failed to create order",error as Error);
            if (conn) {
                await conn.exec("ROLLBACK");
            }
            throw new DbException("Failed to create order",error as Error);
        }
    }
    async get(id: id): Promise<IIdentifiableOrderItem> {

        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.get<SQLieteOrder>( SELECT_BY_ID,[id]);

            if (!result) {
                throw new Error("Order not found with id: " + id);
            }
            const item = await this.itemRepository.get( result.item_id);

            return new SQLiteOrderMapper().map({data: result,item: item});
        } catch (error: unknown) {
            logger.error("Failed to get order: %s %o",id,error as Error);
            throw new DbException("Failed to get order: " + id,error as Error);
        }
    }
    async getAll(): Promise<IIdentifiableOrderItem[]> {

        try {
            const conn =await ConnectionManager.getConnection();
            const items =await this.itemRepository.getAll();

            if (items.length === 0) {
                return [];
            }

            const orders =await conn.all<SQLieteOrder[]>(SELECT_ALL,items[0].getCategory());
            const bindedOrders =orders.map(order => {
                const item = items.find( item =>item.getID() === order.item_id);
                if (!item) {
                    throw new Error(
                        "Item id " +
                        order.item_id +
                        " not found"
                    );
                }
                return {order,item};
            });
            const mapper = new SQLiteOrderMapper();
            return bindedOrders.map(({ order, item }) => mapper.map({ data: order, item}));

        } catch (error: unknown) {
            logger.error("Failed to get all orders",error as Error);
            throw new DbException("Failed to get all orders",error as Error);
        }
    }

    async update(order: IIdentifiableOrderItem): Promise<void> {
        let conn;
        try {
            conn =await ConnectionManager.getConnection();
            await conn.exec("BEGIN TRANSACTION");
            // UPDATE THE ITEM, DON'T DELETE IT
            await this.itemRepository.update(order.getItem());
            await conn.run(UPDATE_ID,[
                    order.getQuantity(),
                    order.getPrice(),
                    order.getItem().getCategory(),
                    order.getItem().getID(),
                    order.getID()
                ]
            );
            await conn.exec("COMMIT");

        } catch (error: unknown) {
            logger.error("Failed to update order of id %s",order.getID(),error as Error);
            if (conn) {
                await conn.exec("ROLLBACK");
            }
            throw new DbException("Failed to update order of id " +order.getID(),error as Error);
        }
    }

    async delete(order: IIdentifiableOrderItem): Promise<void> {
        let conn;
        try {
            conn =await ConnectionManager.getConnection();
            await conn.exec("BEGIN TRANSACTION");
            await this.itemRepository.delete(order.getItem());
            await conn.run(DELETE_ID,order.getID());
            await conn.exec("COMMIT");

        } catch (error: unknown) {
            logger.error("Failed to delete order: %s",order.getID(),error as Error);
            if (conn) {
                await conn.exec("ROLLBACK");
            }
            throw new DbException("Failed to delete order: " +order.getID(),error as Error);
        }
    }
}