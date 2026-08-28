import { AnalyticsService } from "../services/Analytics.service";
import { IIdentifiableOrderItem } from "../model/IOrder";
import { RepositoryFactory } from "../repository/Repository.factory";
import { ItemCategory } from "../model/IItem";

jest.mock("../repository/Repository.factory", () => ({
    RepositoryFactory: {create: jest.fn()}
}));

describe("Analytics Service", () => {
    let analyticsService: AnalyticsService;

    beforeEach(() => {
        jest.clearAllMocks();
        analyticsService = new AnalyticsService();
    });

    it("get total revenue regardless of category", async () => {
        const mockOrders: IIdentifiableOrderItem[] = [
            {
                getItem() {return { getCategory: () => ItemCategory.CAKE };},
                getPrice: () => 10,
                getQuantity: () => 2
            } as IIdentifiableOrderItem,
            {
                getItem() {return { getCategory: () => ItemCategory.BOOK };},
                getPrice: () => 20,
                getQuantity: () => 3
            } as IIdentifiableOrderItem
        ];

        (RepositoryFactory.create as jest.Mock).mockImplementation(async (mode, category) => {
            return {
                getAll: jest.fn().mockResolvedValue(mockOrders.filter(order => order.getItem().getCategory() === category))
            };
        });
        const total = await analyticsService.getTotalRevenue();
        expect(total).toBe(80);
    });

    it("get revenue by category", async () => {
        const mockOrders: IIdentifiableOrderItem[] = [
            {
                getItem() {return { getCategory: () => ItemCategory.CAKE };},
                getPrice: () => 10,
                getQuantity: () => 2
            } as IIdentifiableOrderItem,
            {
                getItem() {return { getCategory: () => ItemCategory.CAKE };},
                getPrice: () => 20,
                getQuantity: () => 3
            } as IIdentifiableOrderItem,
            {
                getItem() {return { getCategory: () => ItemCategory.BOOK };},
                getPrice: () => 30,
                getQuantity: () => 1
            } as IIdentifiableOrderItem
        ];

        (RepositoryFactory.create as jest.Mock).mockImplementation(async (mode, category) => {
            return {
                getAll: jest.fn().mockResolvedValue(mockOrders.filter(order => order.getItem().getCategory() === category))
            };
        });
        const total = await analyticsService.getRevenueByCategory(ItemCategory.CAKE);
        expect(total).toBe(80);
    });

    it("get total order count", async () => {
        const mockOrders: IIdentifiableOrderItem[] = [
            {
                getItem() {return { getCategory: () => ItemCategory.BOOK };},
                getPrice: () => 10,
                getQuantity: () => 2
            } as IIdentifiableOrderItem,
            {
                getItem() {return { getCategory: () => ItemCategory.BOOK };},
                getPrice: () => 20,
                getQuantity: () => 3
            } as IIdentifiableOrderItem,
            {
                getItem() {return { getCategory: () => ItemCategory.BOOK };},
                getPrice: () => 30,
                getQuantity: () => 1
            } as IIdentifiableOrderItem
        ];

        (RepositoryFactory.create as jest.Mock).mockImplementation(async (mode, category) => {
            return {
                getAll: jest.fn().mockResolvedValue(mockOrders.filter(order => order.getItem().getCategory() === category))
            };
        });
        const count = await analyticsService.getTotalOrderCount();
        expect(count).toBe(3);
    });

    it("get order count by category", async () => {
        const mockOrders: IIdentifiableOrderItem[] = [
            {
                getItem() {return { getCategory: () => ItemCategory.CAKE };},
                getPrice: () => 10,
                getQuantity: () => 2
            } as IIdentifiableOrderItem,
            {
                getItem() {return { getCategory: () => ItemCategory.CAKE };},
                getPrice: () => 20,
                getQuantity: () => 3
            } as IIdentifiableOrderItem,
            {
                getItem() {return { getCategory: () => ItemCategory.BOOK };},
                getPrice: () => 30,
                getQuantity: () => 1
            } as IIdentifiableOrderItem
        ];

        (RepositoryFactory.create as jest.Mock).mockImplementation(async (mode, category) => {
            return {
                getAll: jest.fn().mockResolvedValue(mockOrders.filter(order => order.getItem().getCategory() === category))
            };
        });
        const count = await analyticsService.getOrderCountsByCategory(ItemCategory.BOOK);
        expect(count).toBe(1);
    });
});