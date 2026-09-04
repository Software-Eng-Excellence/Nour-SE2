import { AnalyticsController } from "../controllers/analytics.controller";
import { AnalyticsService } from "../services/Analytics.service";
import { ItemCategory } from "../model/IItem";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";

jest.mock("../services/Analytics.service");

describe("AnalyticsController", () => {
    let analyticsService: jest.Mocked<AnalyticsService>;
    let controller: AnalyticsController;
    let res: any;

    beforeEach(() => {
        analyticsService = new AnalyticsService() as jest.Mocked<AnalyticsService>;

        controller = new AnalyticsController(analyticsService);

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it("get total revenue", async () => {
        analyticsService.getTotalRevenue.mockResolvedValue(1500);

        await controller.getTotalRevenue({} as any, res);

        expect(analyticsService.getTotalRevenue).toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({totalRevenue: 1500});
    });

    it("get revenue by cake category", async () => {
        const req = {
            params: {
                category: "cake"
            }
        } as any;

        analyticsService.getRevenueByCategory.mockResolvedValue(700);

        await controller.getRevenueByCategory(req, res);

        expect(analyticsService.getRevenueByCategory).toHaveBeenCalledWith(ItemCategory.CAKE);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({category: ItemCategory.CAKE,revenue: 700});
    });

    it("get revenue by book category", async () => {
        const req = {
            params: {
                category: "book"
            }
        } as any;

        analyticsService.getRevenueByCategory.mockResolvedValue(300);

        await controller.getRevenueByCategory(req, res);

        expect(analyticsService.getRevenueByCategory).toHaveBeenCalledWith(ItemCategory.BOOK);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({category: ItemCategory.BOOK,revenue: 300});
    });

    it("get revenue by toy category", async () => {
        const req = {
            params: {
                category: "toy"
            }
        } as any;

        analyticsService.getRevenueByCategory.mockResolvedValue(500);

        await controller.getRevenueByCategory(req, res);

        expect(analyticsService.getRevenueByCategory).toHaveBeenCalledWith(ItemCategory.TOY);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({category: ItemCategory.TOY,revenue: 500});
    });

    it("get total order count", async () => {
        analyticsService.getTotalOrderCount.mockResolvedValue(42);

        await controller.getTotalOrderCount({} as any, res);

        expect(analyticsService.getTotalOrderCount).toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({ totalOrderCount: 42});
    });

    it("get order count by cake category", async () => {
        const req = {
            params: {
                category: "cake"
            }
        } as any;

        analyticsService.getOrderCountsByCategory.mockResolvedValue(10);

        await controller.getOrderCountsByCategory(req, res);

        expect(analyticsService.getOrderCountsByCategory).toHaveBeenCalledWith(ItemCategory.CAKE);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({category: ItemCategory.CAKE,orderCount: 10});
    });

    it("get order count by book category", async () => {
        const req = {
            params: {
                category: "book"
            }
        } as any;

        analyticsService.getOrderCountsByCategory.mockResolvedValue(8);

        await controller.getOrderCountsByCategory(req, res);

        expect(analyticsService.getOrderCountsByCategory).toHaveBeenCalledWith(ItemCategory.BOOK);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({category: ItemCategory.BOOK,orderCount: 8});
    });

    it("get order count by toy category", async () => {
        const req = {
            params: {
                category: "toy"
            }
        } as any;

        analyticsService.getOrderCountsByCategory.mockResolvedValue(12);

        await controller.getOrderCountsByCategory(req, res);

        expect(analyticsService.getOrderCountsByCategory).toHaveBeenCalledWith(ItemCategory.TOY);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({ category: ItemCategory.TOY, orderCount: 12});
    });

    it("invalid category throwing", async () => {
        const req = {
            params: {
                category: "invalid"
            }
        } as any;

        await expect(controller.getRevenueByCategory(req, res)).rejects.toThrow(BadRequestException);
    });
});