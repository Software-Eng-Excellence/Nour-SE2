import { IIdentifiableItem } from "../../model/IItem";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./connectionManager";
import logger from "../../util/logger";
import {InitializationException,DbException,ItemNotFoundException} from "../../util/exceptions/ItemNotFoundException";
import { psOrder, PSQLOrderMapper } from "../../mapper/Order.mapper";
import { IIdentifiableOrderItem } from "../../model/IOrder";

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS "order" (
    id TEXT PRIMARY KEY,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    item_category TEXT NOT NULL,
    item_id TEXT NOT NULL
);`;

const INSERT_ORDER = ` INSERT INTO "order" ( id, quantity, price, item_category, item_id) VALUES ($1, $2, $3, $4, $5)`;

const GET_ORDER_BY_ID = ` SELECT * FROM "order" WHERE id = $1`;

const GET_ALL = ` SELECT * FROM "order" WHERE item_category = $1`;

const DELETE_ORDER = ` DELETE FROM "order" WHERE id = $1`;

const UPDATE_ORDER = `
UPDATE "order" SET quantity = $1, price = $2, item_category = $3, item_id = $4 WHERE id = $5`;


export class psOrderRepository
    implements IRepository<IIdentifiableOrderItem>, Initializable {

    constructor(
        private readonly itemRepo: IRepository<IIdentifiableItem> & Initializable
    ) {}

    async init(): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            await conn.query(CREATE_TABLE);
            logger.info("Order Table Init");

        } catch (error) {
            logger.error("Order Initialization failed",error as Error);
            throw new InitializationException("Order Initialization failed",error as Error);
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }

    async create(order: IIdentifiableOrderItem): Promise<id> {
        let conn;
        try {
            const item_id = await this.itemRepo.create(order.getItem());
            conn = await ConnectionManager.getConnection();

            await conn.query(INSERT_ORDER, [
                order.getID(),
                order.getQuantity(),
                order.getPrice(),
                order.getItem().getCategory(),
                item_id
            ]);
            logger.info("Order created with ID: %s",order.getID());
            return order.getID();

        } catch (error) {
            logger.error("Failed to create Order",error as Error);
            throw new DbException("Failed to Create Order",error as Error);
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }


    async get(id: id): Promise<IIdentifiableOrderItem> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            const result = await conn.query<psOrder>( GET_ORDER_BY_ID, [id]);

            if (result.rows.length === 0) {
                logger.error("Order not found with id: %s",id);
                throw new ItemNotFoundException("Order not found with id: " + id);
            }
            const orderRow: psOrder = result.rows[0];
            const item: IIdentifiableItem = await this.itemRepo.get(orderRow.item_id);
            const order: IIdentifiableOrderItem = new PSQLOrderMapper().map({ data: orderRow, item});
            logger.info("Order retrieved %o",order);
            return order;

        } catch (error) {
            if (error instanceof ItemNotFoundException) {
                throw error;
            }
            logger.error("Failed to read Order of id: %s %o",id,error as Error);
            throw new DbException("Failed to read Order of id: " + id,error as Error);
        } 
        finally {
            if (conn) {
                conn.release();
            }
        }
    }


    async getAll(): Promise<IIdentifiableOrderItem[]> {
        let conn;
        try {
            const items = await this.itemRepo.getAll();
            if (items.length === 0) {
                return [];
            }
            conn = await ConnectionManager.getConnection();
            const result = await conn.query<psOrder>(GET_ALL,[items[0].getCategory()]);
            const orders: psOrder[] = result.rows;
            const bindedOrders = orders.map(order => {
                const item = items.find( i => i.getID() === order.item_id);
                if (!item) {
                    throw new DbException("Item not found for order id: " + order.id,new Error("item not found"));
                }
                return {order,item};
            });

            return bindedOrders.map(({ order, item }) => new PSQLOrderMapper().map({ data: order,item}));

        } catch (error) {
            logger.error("Failed to read all Order",error as Error);
            throw new DbException("Failed to read all Order",error as Error);
        } 
        finally {
            if (conn) {
                conn.release();
            }
        }
    }

    async update(item: IIdentifiableOrderItem): Promise<void> {
        let conn;
        try {
            await this.itemRepo.update(item.getItem());
            conn = await ConnectionManager.getConnection();
            await conn.query(UPDATE_ORDER, [
                item.getQuantity(),
                item.getPrice(),
                item.getItem().getCategory(),
                item.getItem().getID(),
                item.getID()
            ]);
            logger.info("Order updated with ID: %s",item.getID());

        } catch (error) {
            logger.error("Failed to update order table of id: %s",item.getID(),error as Error);
            throw new DbException("Failed to update Order",error as Error);
        } 
        finally {
            if (conn) {
                conn.release();
            }
        }
    }

    async delete(item: IIdentifiableOrderItem): Promise<void> {
        let conn;
        try {
            await this.itemRepo.delete(item.getItem());
            conn = await ConnectionManager.getConnection();
            await conn.query(DELETE_ORDER,[item.getID()]);
            logger.info("Order deleted with ID: %s",item.getID());
        } catch (error) {
            logger.error("Failed to delete Order",error as Error);
            throw new DbException("Failed to delete Order",error as Error);
        } 
        finally {
            if (conn) {
                conn.release();
            }
        }
    }
}