import { User } from "../../model/User.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/ItemNotFoundException";
import logger from "../../util/logger";
import ConnectionManager from "./ConnectionManager";
import { UserMapper } from "../../mapper/User.mapper";
import { Database } from "sqlite";

const CREATE_TABLE = `
    create table if not exists User(
    id text primary key,
    name text not null,
    email text not null unique,
    password text not null    
    )`

const INSERT_User = `
    insert into User(id, name, email, password) values(?, ?, ?, ?)`

const GET_User_BY_ID = `SELECT * FROM User WHERE id = ?`

const GET_ALL = `SELECT * FROM User`

const DELETE_User = `DELETE FROM User WHERE id = ?`

const UPDATE_User = `update User set name = ?, email = ?, password = ? where id = ?`

export class UserRepository implements IRepository<User>, Initializable {
    private db :Database | null = null;
    
    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            this.db = conn;
            await conn.exec(CREATE_TABLE)
            logger.info("Table Init")
        } catch (error: unknown) {
            logger.error("User Table Initialization failed", error as Error);
            throw new InitializationException("User Table Initialization failed", error as Error);
        }
    }

    async create(item: User): Promise<id> {
        try {
            const conn = await ConnectionManager.getConnection();
            conn.run(INSERT_User, [
                item.getId(),
                item.getName(),
                item.getEmail(),
                item.getPassword()
            ])
            return item.getId();

        } catch (error) {
            logger.error("Failed to create User", error as Error)
            throw new DbException("Failed to Create User", error as Error)
        }
    }

    async get(id: id): Promise<User> {
        try {
            const conn = await ConnectionManager.getConnection()
            const user = await conn.get(GET_User_BY_ID, id);
            if (!user) {
                throw new ItemNotFoundException("User not found with id: " + id);
            }
            return new UserMapper().map(user);

        } catch (error) {
            logger.error("Failed to read User of id: %s %o", id, error as Error)
            throw new DbException("Failed to read User of id: " + id, error as Error)

        }
    }

    async getAll(): Promise<User[]> {
        try {
            const conn = await ConnectionManager.getConnection()
            const user = await conn.all<[]>(GET_ALL);
            if (!user) {
                throw new ItemNotFoundException("Users not found");
            }
            return user.map(item => new UserMapper().map(item));

        } catch (error) {
            logger.error("Failed to read all Users ", error as Error)
            throw new DbException("Failed to read all Users ", error as Error)

        }
    }

    async update(item: User): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection()
            await conn.run(UPDATE_User, [
                item.getName(),
                item.getEmail(),
                item.getPassword(),
                item.getId()
            ]);
        } catch (error) {
            logger.error("Failed to update User of id: %s %o", item.getId(), error as Error)
            throw new DbException("Failed to update User of id: " + item.getId(), error as Error)
        }
    }

    async delete(item: User): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection()
            await conn.run(DELETE_User, item.getId());
        } catch (error) {
            logger.error("Failed to delete User of id: %s %o", item.getId(), error as Error)
            throw new DbException("Failed to delete User of id: " + item.getId(), error as Error)

        }
    }
    async getByEmail(email: string): Promise<User> {
        if(!this.db){
            throw new Error("Database not initialized");
        }
        const user = await this.db.get("SELECT * FROM User WHERE email = ?", email);
        if(!user){
            throw new ItemNotFoundException("User not found");
        }
        return new User(
            user.id,
            user.name,
            user.email,
            user.password
        );
    }

}

export async function createUserRepo() {
    const userRepository = new UserRepository();
    await userRepository.init();
    return userRepository;
}