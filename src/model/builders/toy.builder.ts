import { id } from "../../repository/IRepository";
import logger from "../../util/logger";
import { IdentifiedToy, Toy } from "../Toy.model";

export class ToyBuilder {
    static create() {
        throw new Error("Method not implemented.");
    }

    private name!: string;
    private brand!: string;
    private type!: string;
    private material!: string;
    private color!: string;
    private agerecommendation!: string;
    private price!: number;
    private weight!: number;
    private batteryrequired!: boolean;
    private description!: string;

    public static newBuilder(): ToyBuilder {
        return new ToyBuilder();
    }

    setName(name: string): ToyBuilder {
        this.name = name;
        return this;
    }

    setBrand(brand: string): ToyBuilder {
        this.brand = brand;
        return this;
    }

    setType(type: string): ToyBuilder {
        this.type = type;
        return this;
    }

    setMaterial(material: string): ToyBuilder {
        this.material = material;
        return this;
    }

    setColor(color: string): ToyBuilder {
        this.color = color;
        return this;
    }

    setAgeRecommendation(agerecommendation: string): ToyBuilder {
        this.agerecommendation = agerecommendation;
        return this;
    }

    setPrice(price: number): ToyBuilder {
        this.price = price;
        return this;
    }

    setWeight(weight: number): ToyBuilder {
        this.weight = weight;
        return this;
    }

    setBatteryRequired(batteryrequired: boolean): ToyBuilder {
        this.batteryrequired = batteryrequired;
        return this;
    }

    setDescription(description: string): ToyBuilder {
        this.description = description;
        return this;
    }

    build(): Toy {

        const requiredProperties = [
            this.name,
            this.brand,
            this.type,
            this.material,
            this.color,
            this.agerecommendation,
            this.price,
            this.weight,
            this.batteryrequired,
            this.description
        ];

        for (const property of requiredProperties) {
            if (property === undefined || property === null) {
                logger.error("Missing required properties, couldn't create a Toy");
                throw new Error("Missing required properties");
            }
        }

        return new Toy(
            this.name,
            this.brand,
            this.type,
            this.material,
            this.color,
            this.agerecommendation,
            this.price,
            this.weight,
            this.batteryrequired,
            this.description
        );
    }
}

export class IdentifiableToyBuilder {
    private id!: string;
    private toy!: Toy;

    static newBuilder(): IdentifiableToyBuilder {
        return new IdentifiableToyBuilder();
    }

    setId(id: string): IdentifiableToyBuilder {
        this.id = id;
        return this;
    }

    setToy(toy: Toy): IdentifiableToyBuilder {
        this.toy = toy;
        return this;
    }

    build(): IdentifiedToy {

        if (!this.id || !this.toy) {
            logger.error("error missing identifiable toy properties");
            throw new Error("Missing required properties");
        }

        return new IdentifiedToy(
            this.id,
            this.toy.getName(),
            this.toy.getBrand(),
            this.toy.getType(),
            this.toy.getMaterial(),
            this.toy.getColor(),
            this.toy.getAgeRecommendation(),
            this.toy.getPrice(),
            this.toy.getWeight(),
            this.toy.isBatteryRequired(),
            this.toy.getDescription()
        );
    }
}