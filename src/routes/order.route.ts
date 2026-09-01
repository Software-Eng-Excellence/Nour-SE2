import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { orderManagmentService } from "../services/orderManagment.service";
import {asyncHandler} from "../middleware/asyncHandler";

const orderController = new OrderController(new orderManagmentService());

const route = Router();

// setup paths and methods
route.route('/')
     .get(asyncHandler(orderController.getAllOrders.bind(orderController)))
     .post(asyncHandler(orderController.createOrder.bind(orderController)));

route.route('/:id')
    .get(asyncHandler(orderController.getOrder.bind(orderController)))
    .put(asyncHandler(orderController.updateOrder.bind(orderController)))
    .delete(asyncHandler(orderController.deleteOrder.bind(orderController)));

export default route;