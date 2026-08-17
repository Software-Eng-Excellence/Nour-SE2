import { psCakeOrderRepository } from "../repository/psql/cake.order.repository";
import {CakeBuilder,IdentifiableCakeBuilder} from "../model/builders/cake.builder";

jest.setTimeout(30000);

describe("PostgreSQL Cake Repository", () => {

    let cakeRepo: psCakeOrderRepository;

    beforeAll(async () => {
        cakeRepo = new psCakeOrderRepository();
        await cakeRepo.init();
    });


    it("should create a cake and retrieve it", async () => {

        const cakeId = Math.floor(Math.random() * 100000).toString();

        const cake = IdentifiableCakeBuilder.newBuilder()
            .setID(cakeId)
            .setCake(
                CakeBuilder.newBuilder()
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
                    .setAllergies("Nuts")
                    .setSpecialIngredients("Organic Cocoa")
                    .setPackagingType("Box")
                    .build()
            )
            .build();

        const id = await cakeRepo.create(cake);

        expect(id).toBe(cakeId);

        const data = await cakeRepo.get(cakeId);

        expect(data).toBeDefined();
        expect(data.getID()).toBe(cakeId);
        expect(data.getType()).toBe("Birthday");
        expect(data.getFlavor()).toBe("Chocolate");

        await cakeRepo.delete(cake);
    }, 30000);


    it("should update a cake", async () => {

        const cakeId = Math.floor(Math.random() * 100000).toString();

        const cake = IdentifiableCakeBuilder.newBuilder()
            .setID(cakeId)
            .setCake(
                CakeBuilder.newBuilder()
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
                    .setAllergies("Nuts")
                    .setSpecialIngredients("Organic Cocoa")
                    .setPackagingType("Box")
                    .build()
            )
            .build();

        await cakeRepo.create(cake);

        const updatedCake = IdentifiableCakeBuilder.newBuilder()
            .setID(cakeId)
            .setCake(
                CakeBuilder.newBuilder()
                    .setType(cake.getType())
                    .setFlavor("Vanilla")
                    .setFilling("Strawberry")
                    .setSize(10)
                    .setLayers(4)
                    .setFrostingType(cake.getFrostingType())
                    .setFrostingFlavor("Vanilla")
                    .setDecorationType(cake.getDecorationType())
                    .setDecorationColor("Red")
                    .setCustomMessage("Updated Cake")
                    .setShape(cake.getShape())
                    .setAllergies("None")
                    .setSpecialIngredients("None")
                    .setPackagingType(cake.getPackagingType())
                    .build()
            )
            .build();

        await cakeRepo.update(updatedCake);

        const result = await cakeRepo.get(cakeId);

        expect(result.getFlavor()).toBe("Vanilla");
        expect(result.getFilling()).toBe("Strawberry");
        expect(result.getSize()).toBe(10);
        expect(result.getLayers()).toBe(4);
        expect(result.getCustomMessage()).toBe("Updated Cake");

        await cakeRepo.delete(result);
    }, 30000);


    it("should delete a cake", async () => {

        const cakeId = Math.floor(Math.random() * 100000).toString();

        const cake = IdentifiableCakeBuilder.newBuilder()
            .setID(cakeId)
            .setCake(
                CakeBuilder.newBuilder()
                    .setType("Delete")
                    .setFlavor("Chocolate")
                    .setFilling("Cream")
                    .setSize(8)
                    .setLayers(2)
                    .setFrostingType("Buttercream")
                    .setFrostingFlavor("Chocolate")
                    .setDecorationType("Sprinkles")
                    .setDecorationColor("Red")
                    .setCustomMessage("Delete Test")
                    .setShape("Round")
                    .setAllergies("None")
                    .setSpecialIngredients("None")
                    .setPackagingType("Box")
                    .build()
            )
            .build();

        await cakeRepo.create(cake);
        await cakeRepo.delete(cake);
        await expect(cakeRepo.get(cakeId)).rejects.toThrow();
    }, 30000);


    it("should get all cakes", async () => {

        const cakeId1 = Math.floor(Math.random() * 100000).toString();
        const cakeId2 = Math.floor(Math.random() * 100000).toString();

        const cake1 = IdentifiableCakeBuilder.newBuilder()
            .setID(cakeId1)
            .setCake(
                CakeBuilder.newBuilder()
                    .setType("Birthday")
                    .setFlavor("Chocolate")
                    .setFilling("Cream")
                    .setSize(8)
                    .setLayers(2)
                    .setFrostingType("Buttercream")
                    .setFrostingFlavor("Chocolate")
                    .setDecorationType("Sprinkles")
                    .setDecorationColor("Blue")
                    .setCustomMessage("Cake One")
                    .setShape("Round")
                    .setAllergies("None")
                    .setSpecialIngredients("None")
                    .setPackagingType("Box")
                    .build()
            )
            .build();

        const cake2 = IdentifiableCakeBuilder.newBuilder()
            .setID(cakeId2)
            .setCake(
                CakeBuilder.newBuilder()
                    .setType("Wedding")
                    .setFlavor("Strawberry")
                    .setFilling("Cream Cheese")
                    .setSize(12)
                    .setLayers(3)
                    .setFrostingType("Fondant")
                    .setFrostingFlavor("Strawberry")
                    .setDecorationType("Flowers")
                    .setDecorationColor("White")
                    .setCustomMessage("Cake Two")
                    .setShape("Square")
                    .setAllergies("None")
                    .setSpecialIngredients("Raspberry")
                    .setPackagingType("Premium Box")
                    .build()
            )
            .build();

        await cakeRepo.create(cake1);
        await cakeRepo.create(cake2);

        const cakes = await cakeRepo.getAll();

        expect(Array.isArray(cakes)).toBe(true);

        expect(cakes.some(cake => cake.getID() === cakeId1)).toBe(true);

        expect(cakes.some(cake => cake.getID() === cakeId2)).toBe(true);

        await cakeRepo.delete(cake1);
        await cakeRepo.delete(cake2);
    }, 30000);


    it("should reject duplicate cake ID", async () => {

        const cakeId = Math.floor(Math.random() * 100000).toString();

        const cake = IdentifiableCakeBuilder.newBuilder()
            .setID(cakeId)
            .setCake(
                CakeBuilder.newBuilder()
                    .setType("Birthday")
                    .setFlavor("Chocolate")
                    .setFilling("Cream")
                    .setSize(8)
                    .setLayers(2)
                    .setFrostingType("Buttercream")
                    .setFrostingFlavor("Chocolate")
                    .setDecorationType("Sprinkles")
                    .setDecorationColor("Blue")
                    .setCustomMessage("Duplicate")
                    .setShape("Round")
                    .setAllergies("None")
                    .setSpecialIngredients("None")
                    .setPackagingType("Box")
                    .build()
            )
            .build();

        await cakeRepo.create(cake);
        await expect(cakeRepo.create(cake)).rejects.toThrow();

        await cakeRepo.delete(cake);
    }, 30000);

    it("should throw when getting a non-existing cake", async () => {
        const id = `cake-does-not-exist-${Date.now()}`;
        await expect(cakeRepo.get(id)).rejects.toThrow();
    }, 30000);


    it("should throw error on null cake values", () => {

        expect(() => {
            CakeBuilder.newBuilder()
                .setType(null as any)
                .setFlavor("Chocolate")
                .setFilling("Cream")
                .setSize(8)
                .setLayers(2)
                .setFrostingType("Buttercream")
                .setFrostingFlavor("Chocolate")
                .setDecorationType("Sprinkles")
                .setDecorationColor("Blue")
                .setCustomMessage("Test")
                .setShape("Round")
                .setAllergies("None")
                .setSpecialIngredients("None")
                .setPackagingType("Box")
                .build();
        }).toThrow();
    });

});