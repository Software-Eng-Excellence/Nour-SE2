import config from "../config";
import { ItemCategory } from "../model/IItem";
import { IIdentifiableOrderItem } from "../model/IOrder";
import { IRepository } from "../repository/IRepository";
import { RepositoryFactory } from "../repository/Repository.factory";

export class AnalyticsService {

    private async getRepo(category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
        return RepositoryFactory.create(config.dbMode, category);
    }
    // Calculate total number of orders across all categories
    public async getTotalOrderCount(): Promise<number> {
        const categories = Object.values(ItemCategory);
        let totalCount = 0;
        for (const category of categories) {
            const repo = await this.getRepo(category);
            const orders = await repo.getAll();
            totalCount += orders.length;
        }
        return totalCount;
    }
    // Generate order counts grouped by item type
    public async getOrderCountsByCategory(category: ItemCategory): Promise<number> {
        const repo = await this.getRepo(category);
        const orders = await repo.getAll();

        return orders.length;
    }
    // Calculate total revenue across all orders
    public async getTotalRevenue(): Promise<number> {
        const categories = Object.values(ItemCategory);
        let totalRevenue = 0;
        for (const category of categories) {
            const repo = await this.getRepo(category);
            const orders = await repo.getAll();
            for (const order of orders) {
                totalRevenue += order.getPrice() * order.getQuantity();
            }
        }
        return totalRevenue;
    }
    // Compute revenue breakdown by item type
    public async getRevenueByCategory(category: ItemCategory): Promise<number> {
        const repo = await this.getRepo(category);
        const orders = await repo.getAll();
        const revenues = orders.map(order => order.getPrice() * order.getQuantity());
        let total = 0;
        for (const revenue of revenues) {
            total += revenue;
        }
        return total;
    }
}