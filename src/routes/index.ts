import { Router } from "express";
import OrderRoutes from "./order.route";
import AnalyticsRoutes from "./analytics.route";
import userRoutes from "./user.route";
import AuthRoute from "./auth.route";
import { authenticate } from "../middleware/auth";

const routes = Router();

routes.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

routes.use('/orders', authenticate, OrderRoutes);
routes.use('/analytics',AnalyticsRoutes);
routes.use('/users', userRoutes);
routes.use("/auth", AuthRoute);

export default routes;