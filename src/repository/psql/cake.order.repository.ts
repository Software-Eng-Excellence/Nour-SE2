import logger from "../../util/logger";
import { IdentifiableCake } from "../../model/Cake.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./connectionManager";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/ItemNotFoundException";
import { ItemCategory } from "../../model/IItem";
import { psCake, psCakeMapper} from "../../mapper/Cake.mapper";

const TableName = ItemCategory.CAKE;

const CREATE_TABLE = `
    create table if not exists ${TableName}(
    id text primary key,
    type text not null,
    flavor text not null,
    filling text not null,
    size integer not null,
    layers integer not null,
    frostingType text not null,
    frostingFlavor text not null,
    decorationType text not null,
    decorationColor text not null,
    customMessage text not null,
    shape text not null,
    allergies text not null,
    specialIngredients text not null,
    packagingType text not null
    )`

const INSERT_CAKE = `insert into ${TableName} (
        id, type, flavor, filling, size, layers, frostingType, frostingFlavor, decorationType, decorationColor, customMessage, shape, allergies, specialIngredients, packagingType
        ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`;

const GET_CAKE_BY_ID = `SELECT * FROM ${TableName} WHERE id = $1`

const GET_ALL = `SELECT * FROM ${TableName}`

const DELETE_CAKE = `DELETE FROM ${TableName} WHERE id = $1`

const UPDATE_CAKE = `update ${TableName} set type = $1, flavor = $2, filling = $3, size = $4, layers = $5, frostingType = $6, frostingFlavor = $7, decorationType = $8, decorationColor = $9, customMessage = $10, shape = $11, allergies = $12, specialIngredients = $13, packagingType = $14 where id = $15`

export class psCakeOrderRepository implements IRepository<IdentifiableCake>, Initializable {
    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(CREATE_TABLE)
            conn.release();
            logger.info("Cake Table Init")
        } catch (error) {
            logger.error("Cake Table Initialization failed", error as Error);
            throw new InitializationException("Cake Table Initialization failed", error as Error);
        }
    }

    async create(item: IdentifiableCake): Promise<id> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(INSERT_CAKE, [
                item.getID(),
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType()
            ])
            logger.info("Cake created with ID: %s", item.getID());
            conn.release();
            return item.getID();
        } catch (error) {
            logger.error("Failed to create Cake", error as Error)
            throw new DbException("Failed to Create Cake", error as Error)
        }
    }

    async get(id: id): Promise<IdentifiableCake> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            const result = await conn.query<psCake>(GET_CAKE_BY_ID,[id]);
            if (result.rows.length === 0) {
                logger.error("Cake not found with id: %s", id);
                throw new ItemNotFoundException("Cake not found with id: " + id);
            }
            return new psCakeMapper().map(result.rows[0]);

        } catch (error) {
            if (error instanceof ItemNotFoundException) {
                throw error;
            }
            logger.error("Failed to read Cake of id: %s %o",id,error as Error);
            throw new DbException("Failed to read Cake of id: " + id,error as Error);
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }

    async getAll(): Promise<IdentifiableCake[]> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            const cake = await conn.query<psCake>(GET_ALL);
            if (cake.rows.length === 0) {
                throw new ItemNotFoundException("Cakes not found");
            }
            return cake.rows.map( item => new psCakeMapper().map(item));

        } catch (error) {
            if (error instanceof ItemNotFoundException) {
                throw error;
            }
            logger.error("Failed to read all Cakes", error as Error);
            throw new DbException("Failed to read all Cakes",error as Error);
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }
   async update(item: IdentifiableCake): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(UPDATE_CAKE, [
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType(),
                item.getID()
            ]);
            conn.release();

        } catch (error) {
            logger.error("Failed to update Cake of id: %s %o",item.getID(),error as Error);
            throw new DbException("Failed to update Cake of id: " + item.getID(),error as Error);
        }
    }

    async delete(item: IdentifiableCake): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(DELETE_CAKE,[item.getID()]);
            logger.info("Cake deleted with ID: %s", item.getID());
            conn.release();

        } catch (error) {
            logger.error("Failed to delete Cake of id: %s %o",item.getID(),error as Error);
            throw new DbException("Failed to delete Cake of id: " + item.getID(),error as Error);
        }
    }

}