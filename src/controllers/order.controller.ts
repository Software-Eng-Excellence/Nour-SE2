import { Request, Response } from 'express';
import { orderManagmentService } from "../services/orderManagment.service";
import { IdentifiableOrderItem } from '../model/Order.model';
import { JsonRequestFactory } from '../mapper';
import { BadRequestException } from '../util/exceptions/http/BadRequestException';

export class OrderController {
    constructor(private readonly orderService: orderManagmentService) { }

    // create an order    
    public async createOrder(req: Request, res: Response) {
        const order: IdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body);
        if (!order) {
            throw new BadRequestException("Order is required to create order" ,{
                OrderNotFound: true
            });
        }
        const newOrder = await this.orderService.createOrder(order);
        res.status(201).json(newOrder);
    }
    // get order
    public async getOrder(req: Request, res: Response) {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            throw new BadRequestException("Id is required to get order",{
                IdNotFound: true
            });
        }
        const order = await this.orderService.getOrder(id);
        res.status(200).json(order);
    }
    // get all orders
    public async getAllOrders(req: Request, res: Response) {
        const orders = await this.orderService.getAllOrders();
        res.status(200).json(orders);
    }
    // update order
    public async updateOrder(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            throw new BadRequestException("Id is required to update order",{
                IdNotFound: true
            });
        }
        const order: IdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body);
        if (!order) {
            throw new BadRequestException("Order is required to update order",{
                OrderNotDefined: true
            });
        }
        if (order.getID() !== id) {
            throw new BadRequestException("Id in the body is different than id in params",{
                IdMismatch: true,
                IdInBody: order.getID(),
                IdInParams: id
            });
        }
        await this.orderService.updateOrder(order);
        res.status(200).json(order);
    }
    //delete order
    public async deleteOrder(req: Request, res: Response) {
        const id = req.params.id;
            if (!id || Array.isArray(id)) {
        throw new BadRequestException("Id is required to get order",{
            IdNotDefined: true
        });
        }
        await this.orderService.deleteOrder(id);
        res.status(204).send({ message: "Order deleted successfully" });
    }
}