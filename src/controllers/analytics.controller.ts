import { Request, Response } from "express";
import { AnalyticsService } from "../services/Analytics.service";
import { ItemCategory } from "../model/IItem";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";

export class AnalyticsController {
    constructor(private readonly analyticService: AnalyticsService) { }

    private readonly activeCategories: ItemCategory[] = [
        ItemCategory.CAKE,
        ItemCategory.BOOK,
        ItemCategory.TOY
    ];

    private validateCategory(category: string): ItemCategory {
        if (!this.activeCategories.includes(category as ItemCategory)) {
            throw new BadRequestException(`Invalid category: ${category}`);
        }

        return category as ItemCategory;
    }

    public async getTotalRevenue(req: Request, res: Response) {
        const totalRevenue = await this.analyticService.getTotalRevenue();

        res.status(200).json({ totalRevenue });
    }

    public async getRevenueByCategory(req: Request, res: Response) {
        const category = req.params.category;

        if (!category || Array.isArray(category)) {
            throw new BadRequestException("Category is required", {CategoryNotFound: true});
        }

        const validCategory = this.validateCategory(category);

        const revenue = await this.analyticService.getRevenueByCategory(validCategory);

        res.status(200).json({category: validCategory, revenue});
    }

    public async getTotalOrderCount(req: Request, res: Response) {
        const totalOrderCount = await this.analyticService.getTotalOrderCount();

        res.status(200).json({ totalOrderCount });
    }

    public async getOrderCountsByCategory(req: Request, res: Response) {
        const category = req.params.category;

        if (!category || Array.isArray(category)) {
            throw new BadRequestException("Category is required", {CategoryNotFound: true});
        }

        const validCategory = this.validateCategory(category);

        const orderCount = await this.analyticService.getOrderCountsByCategory(validCategory);

        res.status(200).json({category: validCategory, orderCount});
    }
}