import { psOrderRepository } from "../repository/psql/order.repository";
import { psCakeOrderRepository } from "../repository/psql/cake.order.repository";
import {CakeBuilder,IdentifiableCakeBuilder} from "../model/builders/cake.builder";
import {IdentifiableOrderItemBuilder,OrderBuilder} from "../model/builders/order.builder";

jest.setTimeout(30000);

describe("PostgreSQL Order Repository", () => {

    let cakeRepo: psCakeOrderRepository;
    let orderRepo: psOrderRepository;

    beforeAll(async () => {

        cakeRepo = new psCakeOrderRepository();
        orderRepo = new psOrderRepository(cakeRepo);

        await cakeRepo.init();
        await orderRepo.init();
    });

    const createOrder = (
        orderId: string,
        cakeId: string
    ) => {

        const cake = CakeBuilder.newBuilder()
            .setType("Birthday")
            .setFlavor("Chocolate")
            .setFilling("Vanilla Cream")
            .setSize(8)
            .setLayers(3)
            .setFrostingType("Buttercream")
            .setFrostingFlavor("Chocolate")
            .setDecorationType("Sprinkles")
            .setDecorationColor("Blue")
            .setCustomMessage("Happy Birthday!")
            .setShape("Round")
            .setAllergies("None")
            .setSpecialIngredients("Organic Cocoa")
            .setPackagingType("Box")
            .build();

        const identifiedCake =
            IdentifiableCakeBuilder.newBuilder()
                .setID(cakeId)
                .setCake(cake)
                .build();

        const order =
            OrderBuilder.newBuilder()
                .setId(orderId)
                .setItem(identifiedCake)
                .setPrice(50)
                .setQuantity(2)
                .build();

        return IdentifiableOrderItemBuilder
            .newBuilder()
            .setItem(identifiedCake)
            .setOrder(order)
            .build();
    };


    it("should create an order and retrieve it", async () => {

        const orderId = Math.floor(Math.random() * 100000).toString();
        const cakeId = Math.floor(Math.random() * 100000).toString();

        const order = createOrder(orderId, cakeId);
        const id = await orderRepo.create(order);

        expect(id).toBe(orderId);

        const data = await orderRepo.get(orderId);

        expect(data).toBeDefined();
        expect(data.getID()).toBe(orderId);
        expect(data.getQuantity()).toBe(2);
        expect(data.getPrice()).toBe(50);

        await orderRepo.delete(data);
    }, 30000);


    it("should update an order", async () => {

        const orderId = Math.floor(Math.random() * 100000).toString();
        const cakeId = Math.floor(Math.random() * 100000).toString();

        const order = createOrder(orderId, cakeId);

        await orderRepo.create(order);

        const updatedOrder =
            IdentifiableOrderItemBuilder
                .newBuilder()
                .setItem(order.getItem())
                .setOrder(
                    OrderBuilder.newBuilder()
                        .setId(orderId)
                        .setItem(order.getItem())
                        .setPrice(75)
                        .setQuantity(5)
                        .build()
                )
                .build();

        await orderRepo.update(updatedOrder);

        const result = await orderRepo.get(orderId);

        expect(result.getPrice()).toBe(75);
        expect(result.getQuantity()).toBe(5);

        await orderRepo.delete(result);
    }, 30000);


    it("should delete an order", async () => {

        const orderId = Math.floor(Math.random() * 100000).toString();
        const cakeId = Math.floor(Math.random() * 100000).toString();

        const order = createOrder(orderId, cakeId);

        await orderRepo.create(order);

        const createdOrder = await orderRepo.get(orderId);

        await orderRepo.delete(createdOrder);

        await expect(orderRepo.get(orderId)).rejects.toThrow();
    }, 30000);


    it("should get all orders", async () => {

        const orderId1 = Math.floor(Math.random() * 100000).toString();
        const cakeId1 = Math.floor(Math.random() * 100000).toString();

        const orderId2 = Math.floor(Math.random() * 100000).toString();
        const cakeId2 = Math.floor(Math.random() * 100000).toString();

        const order1 = createOrder(orderId1, cakeId1);
        const order2 = createOrder(orderId2, cakeId2);

        await orderRepo.create(order1);
        await orderRepo.create(order2);

        const orders = await orderRepo.getAll();

        expect(Array.isArray(orders)).toBe(true);

        expect(orders.some(order => order.getID() === orderId1)).toBe(true);

        expect(orders.some(order => order.getID() === orderId2)).toBe(true);

        const createdOrder1 = await orderRepo.get(orderId1);
        const createdOrder2 = await orderRepo.get(orderId2);

        await orderRepo.delete(createdOrder1);
        await orderRepo.delete(createdOrder2);
    }, 30000);


    it("should reject duplicate order ID", async () => {

        const orderId = Math.floor(Math.random() * 100000).toString();
        const cakeId = Math.floor(Math.random() * 100000).toString();

        const order = createOrder(orderId, cakeId);
        await orderRepo.create(order);
        /*
         * The order ID is a primary key in PostgreSQL
         * So, creating another order with the same ID
         * must fail
         */
        await expect(orderRepo.create(order)).rejects.toThrow();

        const createdOrder = await orderRepo.get(orderId);
        await orderRepo.delete(createdOrder);
    }, 30000);


    it("should throw when getting a non-existing order", async () => {

        const orderId = Math.floor(Math.random() * 100000).toString();

        await expect(orderRepo.get(orderId)).rejects.toThrow();
    }, 30000);

});