import logger from "../../util/logger";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./connectionManager";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/ItemNotFoundException";
import { ItemCategory } from "../../model/IItem";
import { IdentifiedBook } from "../../model/Book.model";
import { psBook, psBookMapper } from "../../mapper/Book.mapper";

const TableName = ItemCategory.BOOK;

const CREATE_TABLE = `
    CREATE TABLE IF NOT EXISTS ${TableName}(
    orderId text primary key,
    title text not null,
    author text not null,
    genre text not null,
    language text not null,
    publisher text not null,
    publicationYear integer not null,
    isbn text not null,
    numberOfPages integer not null,
    format text not null,
    description text not null
    )`

const INSERT_BOOK = `INSERT INTO ${TableName} ( orderId,title,author,genre,language,publisher,publicationYear,isbn,numberOfPages,format,description )values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;

const GET_BOOK_BY_ID =`SELECT * FROM ${TableName} WHERE orderid = $1`;

const GET_ALL =`SELECT * FROM ${TableName}`;

const DELETE_BOOK =`DELETE FROM ${TableName} WHERE orderid = $1`;

const UPDATE_BOOK = `UPDATE ${TableName} SET title = $1,author = $2,genre = $3,language = $4,publisher = $5,publicationyear = $6,isbn = $7,numberofpages = $8,format = $9,description = $10 WHERE orderid = $11`;


export class psBookOrderRepository implements IRepository<IdentifiedBook>, Initializable {
    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(CREATE_TABLE)
            logger.info("Book Table Init")
        } catch (error) {
            logger.error("Book Table Initialization failed", error as Error);
            throw new InitializationException("Book Table Initialization failed", error as Error);
        }
    }

    async create(item: IdentifiedBook): Promise<id> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            await conn.query(INSERT_BOOK, [
            item.getId(),
            item.getTitle(),
            item.getAuthor(),
            item.getGenre(),
            item.getLanguage(),
            item.getPublisher(),
            item.getPublicationYear(),
            item.getIsbn(),
            item.getNumberOfPages(),
            item.getFormat(),
            item.getDescription()
            ])
            logger.info("Book created with ID: %s", item.getId());
            return item.getId();

        } catch (error) {
            logger.error("Failed to create Book", error as Error)
            throw new DbException("Failed to Create Book", error as Error)
        }
        finally {
            conn?.release();
        }
    }

    async get(id: id): Promise<IdentifiedBook> {
        let conn;
        try {
             conn = await ConnectionManager.getConnection();
            const result = await conn.query<psBook>(GET_BOOK_BY_ID,[id]);

            if (result.rows.length === 0) {
                throw new ItemNotFoundException("Book not found with id: " + id);
            }
            return new psBookMapper().map(result.rows[0]);
        } catch (error) {
            logger.error("Failed to read Book of id: %s %o",id,error as Error);
            throw new DbException("Failed to read Book of id: " + id,error as Error);

        } 
        finally {
            conn?.release();
        }
    }

    async getAll(): Promise<IdentifiedBook[]> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection()
            const book = await conn.query<psBook>(GET_ALL);
            const final: psBook[] = book.rows;

            if (book.rows.length === 0) {
                throw new ItemNotFoundException("Books not found");
            }
            return final.map(item => new psBookMapper().map(item));

        } catch (error) {
            logger.error("Failed to read all Books ", error as Error)
            throw new DbException("Failed to read all Books ", error as Error)
        }
        finally {
            conn?.release();
        }
    }

    async update(item: IdentifiedBook): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection()
            await conn.query(UPDATE_BOOK, [
                item.getTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getLanguage(),
                item.getPublisher(),
                item.getPublicationYear(),
                item.getIsbn(),
                item.getNumberOfPages(),
                item.getFormat(),
                item.getDescription(),
                item.getId()
            ]);
        } catch (error) {
            logger.error("Failed to update Book of id: %s %o", item.getId(), error as Error)
            throw new DbException("Failed to update Book of id: " + item.getId(), error as Error)
        }
        finally {
            conn?.release();
        }
    }

    async delete(item: IdentifiedBook): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection()
            await conn.query(DELETE_BOOK, [item.getId()]);
            logger.info("Book deleted with ID: %s", item.getId());
        } catch (error) {
            logger.error("Failed to delete Book of id: %s %o", item.getId(), error as Error)
            throw new DbException("Failed to delete Book of id: " + item.getId(), error as Error)
        }
        finally {
            conn?.release();
        }
    }
}