import { id } from "../repository/IRepository";
import { IIdentifiableItem, IItem, ItemCategory } from "./IItem";

export class Toy implements IItem {
    getCategory(): ItemCategory {
        return ItemCategory.TOY;
    }

    private name: string;
    private brand: string;
    private type: string;
    private material: string;
    private color: string;
    private agerecommendation: string;
    private price: number;
    private weight: number;
    private batteryrequired: boolean;
    private description: string;

    constructor(
        name: string,
        brand: string,
        type: string,
        material: string,
        color: string,
        agerecommendation: string,
        price: number,
        weight: number,
        batteryrequired: boolean,
        description: string
    ) {
        this.name = name;
        this.brand = brand;
        this.type = type;
        this.material = material;
        this.color = color;
        this.agerecommendation = agerecommendation;
        this.price = price;
        this.weight = weight;
        this.batteryrequired = batteryrequired;
        this.description = description;
    }

    getName(): string {
         return this.name; 
        }
    getBrand(): string {
         return this.brand; 
        }
    getType(): string {
         return this.type; 
        }
    getMaterial(): string {
         return this.material; 
        }
    getColor(): string {
         return this.color; 
        }
    getAgeRecommendation(): string {
         return this.agerecommendation; 
        }
    getPrice(): number {
         return this.price; 
        }
    getWeight(): number {
         return this.weight; 
        }
    isBatteryRequired(): boolean {
         return this.batteryrequired; 
        }
    getDescription(): string {
         return this.description; 
        }
}

export class IdentifiedToy extends Toy implements IIdentifiableItem {

    constructor(
        private id: id,
        name: string,
        brand: string,
        type: string,
        material: string,
        color: string,
        agerecommendation: string,
        price: number,
        weight: number,
        batteryrequired: boolean,
        description: string
    ) {
        super(
            name,
            brand,
            type,
            material,
            color,
            agerecommendation,
            price,
            weight,
            batteryrequired,
            description
        );
    }

    getID(): id {
        return this.id;
    }

    getId(): id {
        return this.id;
    }
}