import { psToyOrderRepository } from "../repository/psql/toy.order.repository";
import {ToyBuilder,IdentifiableToyBuilder} from "../model/builders/toy.builder";

jest.setTimeout(30000);

describe("PostgreSQL Toy Repository", () => {

    let toyRepo: psToyOrderRepository;

    beforeAll(async () => {
        toyRepo = new psToyOrderRepository();
        await toyRepo.init();
    });


    it("should create a toy and retrieve it", async () => {

        const toyId =Math.floor(Math.random() * 100000).toString();

        const toy = IdentifiableToyBuilder.newBuilder()
            .setId(toyId)
            .setToy(
                ToyBuilder.newBuilder()
                    .setName("LEGO Car")
                    .setBrand("LEGO")
                    .setType("Building Toy")
                    .setMaterial("Plastic")
                    .setColor("Red")
                    .setAgeRecommendation("6+")
                    .setPrice(29.99)
                    .setWeight(0.8)
                    .setBatteryRequired(false)
                    .setDescription("A LEGO building toy.")
                    .build()
            )
            .build();

        const id = await toyRepo.create(toy);

        expect(id).toBe(toyId);

        const data = await toyRepo.get(toyId);

        expect(data).toBeDefined();
        expect(data.getId()).toBe(toyId);
        expect(data.getName()).toBe("LEGO Car");
        expect(data.getBrand()).toBe("LEGO");
        expect(data.getAgeRecommendation()).toBe("6+");
        expect(data.isBatteryRequired()).toBe(false);

        await toyRepo.delete(toy);
    }, 30000);


    it("should update a toy", async () => {

        const toyId =Math.floor(Math.random() * 100000).toString();

        const toy = IdentifiableToyBuilder.newBuilder()
            .setId(toyId)
            .setToy(
                ToyBuilder.newBuilder()
                    .setName("LEGO Car")
                    .setBrand("LEGO")
                    .setType("Building Toy")
                    .setMaterial("Plastic")
                    .setColor("Red")
                    .setAgeRecommendation("6+")
                    .setPrice(29.99)
                    .setWeight(0.8)
                    .setBatteryRequired(false)
                    .setDescription("Original toy.")
                    .build()
            )
            .build();

        await toyRepo.create(toy);

        const updatedToy = IdentifiableToyBuilder.newBuilder()
            .setId(toyId)
            .setToy(
                ToyBuilder.newBuilder()
                    .setName("LEGO Car Updated")
                    .setBrand(toy.getBrand())
                    .setType(toy.getType())
                    .setMaterial(toy.getMaterial())
                    .setColor("Blue")
                    .setAgeRecommendation("8+")
                    .setPrice(39.99)
                    .setWeight(1.0)
                    .setBatteryRequired(true)
                    .setDescription("Updated LEGO toy.")
                    .build()
            )
            .build();

        await toyRepo.update(updatedToy);

        const result = await toyRepo.get(toyId);

        expect(result.getName()).toBe("LEGO Car Updated");
        expect(result.getColor()).toBe("Blue");
        expect(result.getAgeRecommendation()).toBe("8+");
        expect(result.getPrice()).toBe(39.99);
        expect(result.isBatteryRequired()).toBe(true);

        await toyRepo.delete(result);
    }, 30000);


    it("should delete a toy", async () => {

        const toyId =Math.floor(Math.random() * 100000).toString();

        const toy = IdentifiableToyBuilder.newBuilder()
            .setId(toyId)
            .setToy(
                ToyBuilder.newBuilder()
                    .setName("Delete Toy")
                    .setBrand("Test Brand")
                    .setType("Test Toy")
                    .setMaterial("Plastic")
                    .setColor("Green")
                    .setAgeRecommendation("5+")
                    .setPrice(20)
                    .setWeight(0.5)
                    .setBatteryRequired(false)
                    .setDescription("Delete test toy.")
                    .build()
            )
            .build();

        await toyRepo.create(toy);
        await toyRepo.delete(toy);

        await expect(toyRepo.get(toyId)).rejects.toThrow();
    }, 30000);


    it("should get all toys", async () => {

        const toyId1 =Math.floor(Math.random() * 100000).toString();
        const toyId2 =Math.floor(Math.random() * 100000).toString();

        const toy1 = IdentifiableToyBuilder.newBuilder()
            .setId(toyId1)
            .setToy(
                ToyBuilder.newBuilder()
                    .setName("Toy One")
                    .setBrand("LEGO")
                    .setType("Building Toy")
                    .setMaterial("Plastic")
                    .setColor("Red")
                    .setAgeRecommendation("6+")
                    .setPrice(20)
                    .setWeight(0.5)
                    .setBatteryRequired(false)
                    .setDescription("Toy one.")
                    .build()
            )
            .build();

        const toy2 = IdentifiableToyBuilder.newBuilder()
            .setId(toyId2)
            .setToy(
                ToyBuilder.newBuilder()
                    .setName("Toy Two")
                    .setBrand("Mattel")
                    .setType("Action Toy")
                    .setMaterial("Plastic")
                    .setColor("Blue")
                    .setAgeRecommendation("8+")
                    .setPrice(30)
                    .setWeight(0.7)
                    .setBatteryRequired(true)
                    .setDescription("Toy two.")
                    .build()
            )
            .build();

        await toyRepo.create(toy1);
        await toyRepo.create(toy2);

        const toys = await toyRepo.getAll();

        expect(Array.isArray(toys)).toBe(true);

        expect(
            toys.some(toy => toy.getId() === toyId1)
        ).toBe(true);

        expect(
            toys.some(toy => toy.getId() === toyId2)
        ).toBe(true);

        await toyRepo.delete(toy1);
        await toyRepo.delete(toy2);
    }, 30000);


    it("should reject duplicate toy ID", async () => {

        const toyId =Math.floor(Math.random() * 100000).toString();

        const toy = IdentifiableToyBuilder.newBuilder()
            .setId(toyId)
            .setToy(
                ToyBuilder.newBuilder()
                    .setName("Duplicate Toy")
                    .setBrand("LEGO")
                    .setType("Building Toy")
                    .setMaterial("Plastic")
                    .setColor("Red")
                    .setAgeRecommendation("6+")
                    .setPrice(20)
                    .setWeight(0.5)
                    .setBatteryRequired(false)
                    .setDescription("Duplicate test.")
                    .build()
            )
            .build();

        await toyRepo.create(toy);

        await expect(toyRepo.create(toy)).rejects.toThrow();

        await toyRepo.delete(toy);
    }, 30000);


    it("should throw when getting a non-existing toy", async () => {

        const id =Math.floor(Math.random() * 100000).toString();

        await expect(toyRepo.get(id)).rejects.toThrow();
    }, 30000);


    it("should throw error on null toy values", () => {

        expect(() => {
            ToyBuilder.newBuilder()
                .setName(null as any)
                .setBrand("LEGO")
                .setType("Building Toy")
                .setMaterial("Plastic")
                .setColor("Red")
                .setAgeRecommendation("6+")
                .setPrice(20)
                .setWeight(0.5)
                .setBatteryRequired(false)
                .setDescription("Test")
                .build();
        }).toThrow();
    });

});