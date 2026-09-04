import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { AnalyticsService } from "../services/Analytics.service";
import { asyncHandler } from "../middleware/asyncHandler";

const analyticsController = new AnalyticsController(new AnalyticsService());

const route = Router();

route.get("/orders", asyncHandler( analyticsController.getTotalOrderCount.bind(analyticsController)));

route.get("/orders/:category", asyncHandler(analyticsController.getOrderCountsByCategory.bind(analyticsController)));

route.get("/revenue", asyncHandler(analyticsController.getTotalRevenue.bind(analyticsController)));

route.get("/revenue/:category", asyncHandler(analyticsController.getRevenueByCategory.bind(analyticsController)));

export default route;