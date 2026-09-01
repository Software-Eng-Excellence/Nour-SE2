import { NextFunction, Request, Response } from 'express';
import { orderManagmentService } from "../services/orderManagment.service";
import logger from '../util/logger';
import { ApiException } from '../util/exceptions/ApiException';
import { IdentifiableOrderItem } from '../model/Order.model';
import { JsonRequestFactory } from '../mapper';

export class OrderController {
    constructor(private readonly orderService: orderManagmentService) { }

    // create an order    
    public async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const order: IdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body);
            if (!order) {
                throw new Error("Order is required to create order");
            }
            const newOrder = await this.orderService.createOrder(order);
            res.status(201).json(newOrder);
        } catch (error) {
            logger.error("Error in createOrder:", error);
            next(new ApiException(400, "Error while creating order"));
        }
    }
    // get order
    public async getOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;

            if (!id || Array.isArray(id)) {
                throw new Error("Id is required to get order");
            }

            const order = await this.orderService.getOrder(id);

            res.status(200).json(order);
        } catch (error) {
            logger.error("Error in getOrder:", error);
            next(new ApiException(500, "Error while getting order"));
        }
    }
    // get all orders
    public async getAllOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await this.orderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            logger.error("Error in getAllOrders:", error);
            next(new ApiException(500, "Error while getting all orders"));
        }
    }
    // update order
    public async updateOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            if (!id) {
                throw new Error("Id is required to update order");
            }
            const order: IdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body);
            if (!order) {
                throw new Error("Order is required to update order");
            }
            if (order.getID() !== id) {
                throw new Error("Order id in path and body must be same");
            }
            await this.orderService.updateOrder(order);
            res.status(200).json(order);
        } catch (error) {
            logger.error("Error in updateOrder:", error);
            next(new ApiException(400, "Error while updating order"));
        }
    }
    //delete order
    public async deleteOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
             if (!id || Array.isArray(id)) {
            throw new Error("Id is required to get order");
            }
            await this.orderService.deleteOrder(id);
            res.status(204).send({ message: "Order deleted successfully" });
        } catch (error) {
            logger.error("Error in deleteOrder:", error);
            next(new ApiException(500, "Error while deleting order"));
        }
    }
}