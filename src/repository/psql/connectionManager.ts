import config from "../../config";
import { Pool, PoolClient } from "pg";
import { DatabaseConnectionException } from "../../util/exceptions/DatabaseConnectionException";
import logger from "../../util/logger";

export class ConnectionManager {
    private static pool: Pool | null = null;
    private constructor() { }

    public static async getConnection(): Promise<PoolClient> {
        if (this.pool === null) {
            try {
                const connectionString = config.storagePath.psql;
                this.pool = new Pool({ connectionString });
            }
            catch (error: unknown) {
                logger.error("Failed to initialize pool %o", error as Error);
                throw new DatabaseConnectionException("Failed to initialize pool", error as Error);
            }
        }
        try {
            const instance = await this.pool.connect();
            return instance;
        } catch (error) {
            logger.error("Failed to connect to database %o", error as Error);
            throw new DatabaseConnectionException("Failed to connect to database ", error as Error);
        }
    }
}
