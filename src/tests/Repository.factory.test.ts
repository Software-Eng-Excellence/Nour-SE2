import { RepositoryFactory, DMmode } from "../repository/Repository.factory";
import { ItemCategory } from "../model/IItem";
import { OrderRepository } from "../repository/sqlite/Order.repository";
import { CakeOrderRepository } from "../repository/file/Cake.order.repository";
import { psOrderRepository } from "../repository/psql/order.repository";

describe("RepositoryFactory", () => {

    it("should create the correct Cake FILE repository", async () => {
        const repository = await RepositoryFactory.create(DMmode.FILE,ItemCategory.CAKE);
        expect(repository).toBeInstanceOf(CakeOrderRepository);
    });

    it("should create the correct Cake SQLITE repository", async () => {
        const repository = await RepositoryFactory.create(DMmode.SQLITE,ItemCategory.CAKE);
        expect(repository).toBeInstanceOf(OrderRepository);
    });

    it("should create the correct Cake PostgreSQL repository", async () => {
        const repository = await RepositoryFactory.create(DMmode.POSTGRESQL,ItemCategory.CAKE);
        expect(repository).toBeInstanceOf(psOrderRepository);
    });

    it("should create the correct Book PostgreSQL repository", async () => {
        const repository = await RepositoryFactory.create(DMmode.POSTGRESQL,ItemCategory.BOOK);
        expect(repository).toBeInstanceOf(psOrderRepository);
    });

    it("should create the correct Toy PostgreSQL repository", async () => {
        const repository = await RepositoryFactory.create(DMmode.POSTGRESQL,ItemCategory.TOY);
        expect(repository).toBeInstanceOf(psOrderRepository);
    });

    it("should reject unsupported FILE category", async () => {
        await expect(RepositoryFactory.create(DMmode.FILE,ItemCategory.BOOK)).rejects.toThrow("Unsupported category");
    });

    it("should reject unsupported SQLITE category", async () => {
        await expect(RepositoryFactory.create(DMmode.SQLITE,ItemCategory.BOOK)).rejects.toThrow("Unsupported category");
    });
});