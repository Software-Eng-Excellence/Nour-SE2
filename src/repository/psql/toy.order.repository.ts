import logger from "../../util/logger";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./connectionManager";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/ItemNotFoundException";
import { ItemCategory } from "../../model/IItem";
import { IdentifiedToy } from "../../model/Toy.model";
import { psToy, psToyMapper } from "../../mapper/Toy.mapper";

const TableName = ItemCategory.TOY;

const CREATE_TABLE = `
    CREATE TABLE IF NOT EXISTS ${TableName}(
    orderId text primary key,
    name text not null,
    brand text not null,
    type text not null,
    material text not null,
    color text not null,
    agerecommendation text not null,
    price real not null,
    weight real not null,
    batteryrequired boolean not null,
    description text not null
    )`

const INSERT_TOY = `INSERT INTO  ${TableName} (
    orderId,name,brand,type,material,color,agerecommendation,price,weight,batteryrequired,description ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;

const GET_TOY_BY_ID = `SELECT * FROM ${TableName} WHERE "orderid" = $1`

const GET_ALL = `SELECT * FROM ${TableName}`

const DELETE_TOY = `DELETE FROM ${TableName} WHERE "orderid" = $1`

const UPDATE_TOY = `update ${TableName} set name=$1,brand=$2,type=$3,material=$4,color=$5,agerecommendation=$6,price=$7,weight=$8,batteryrequired=$9,description=$10 where "orderid"=$11`

export class psToyOrderRepository implements IRepository<IdentifiedToy>, Initializable {
    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(CREATE_TABLE)
            logger.info("Toy Table Init")
        } catch (error) {
            logger.error("Toy Table Initialization failed", error as Error);
            throw new InitializationException("Toy Table Initialization failed", error as Error);
        }
    }

    async create(item: IdentifiedToy): Promise<id> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            await conn.query(INSERT_TOY, [
                item.getId(),
                item.getName(),
                item.getBrand(),
                item.getType(),
                item.getMaterial(),
                item.getColor(),
                item.getAgeRecommendation(),
                item.getPrice(),
                item.getWeight(),
                item.isBatteryRequired(),
                item.getDescription(),
            ])
            logger.info("Toy created with ID: %s", item.getId());
            return item.getId();

        } catch (error) {
            logger.error("Failed to create Toy", error as Error)
            throw new DbException("Failed to Create Toy", error as Error)
        }
        finally {
            conn?.release();
        }
    }

    async get(id: id): Promise<IdentifiedToy> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection()
            const result = await conn.query<psToy>(GET_TOY_BY_ID, [id]);
            if (result.rows.length === 0) {
                logger.error("Toy not found with id: %s", id);
                throw new ItemNotFoundException("Toy not found with id: " + id);
            }
            const toy = new psToyMapper().map(result.rows[0]);
            return toy;
        } catch (error) {
            logger.error("Failed to read Toy of id: %s %o", id, error as Error)
            throw new DbException("Failed to read Toy of id: " + id, error as Error)
        }
        finally {
            conn?.release();
        }
    }

    async getAll(): Promise<IdentifiedToy[]> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection()
            const toy = await conn.query<psToy>(GET_ALL);
            const final: psToy[] = toy.rows;

            if (toy.rows.length === 0) {
                throw new ItemNotFoundException("Toys not found");
            }
            return final.map(item => new psToyMapper().map(item));
        } catch (error) {
            logger.error("Failed to read all Toys ", error as Error)
            throw new DbException("Failed to read all Toys ", error as Error)
        }
        finally {
            conn?.release();
        }
    }

    async update(item: IdentifiedToy): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection()
            await conn.query(UPDATE_TOY, [
                item.getName(),
                item.getBrand(),
                item.getType(),
                item.getMaterial(),
                item.getColor(),
                item.getAgeRecommendation(),
                item.getPrice(),
                item.getWeight(),
                item.isBatteryRequired(),
                item.getDescription(),
                item.getId(),
            ]);
        } catch (error) {
            logger.error("Failed to update Toy of id: %s %o", item.getId(), error as Error)
            throw new DbException("Failed to update Toy of id: " + item.getId(), error as Error)
        }
        finally {
            conn?.release();
        }
    }

    async delete(item: IdentifiedToy): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection()
            await conn.query(DELETE_TOY, [item.getId()]);
            logger.info("Toy deleted with ID: %s", item.getId());
        } catch (error) {
            logger.error("Failed to delete Toy of id: %s %o", item.getId(), error as Error)
            throw new DbException("Failed to delete Toy of id: " + item.getId(), error as Error)
        }
        finally {
            conn?.release();
        }
    }
}