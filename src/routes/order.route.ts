import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { orderManagmentService } from "../services/orderManagment.service";

const orderController = new OrderController(new orderManagmentService());

const route = Router();

// setup paths and methods
route.route('/')
     .get(orderController.getAllOrders.bind(orderController))
     .post(orderController.createOrder.bind(orderController));

route.route('/:id')
    .get(orderController.getOrder.bind(orderController))
    .put(orderController.updateOrder.bind(orderController))
    .delete(orderController.deleteOrder.bind(orderController));

export default route;