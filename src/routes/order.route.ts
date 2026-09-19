import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { orderManagmentService } from "../services/orderManagment.service";
import {asyncHandler} from "../middleware/asyncHandler";
import { hasPermission } from "../middleware/authorize";
import { Permission } from "../config/roles";

const orderController = new OrderController(new orderManagmentService());

const route = Router();

// setup paths and methods
route.route('/')
     .get(asyncHandler(orderController.getAllOrders.bind(orderController)))
     .post(asyncHandler(orderController.createOrder.bind(orderController)));

route.route('/:id')
    .get(hasPermission(Permission.read_order), asyncHandler(orderController.getOrder.bind(orderController)))
    .put(hasPermission(Permission.update_order), asyncHandler(orderController.updateOrder.bind(orderController)))
    .delete(hasPermission(Permission.delete_order), asyncHandler(orderController.deleteOrder.bind(orderController)));

export default route;