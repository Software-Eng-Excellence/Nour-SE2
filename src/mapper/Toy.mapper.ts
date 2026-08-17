import { IdentifiedToy, Toy } from "../model/Toy.model";
import { IMapper } from "./IMapper";
import { IdentifiableToyBuilder, ToyBuilder } from "../model/builders/toy.builder";

export class XMLToyMapper implements IMapper<{ [key: string]: string }, Toy> {
    map(data: { [key: string]: string }): Toy {
        return ToyBuilder.newBuilder()
            .setName(data["Name"])
            .setBrand(data["Brand"])
            .setType(data["Type"])
            .setMaterial(data["Material"])
            .setColor(data["Color"])
            .setAgeRecommendation(data["AgeRecommendation"])
            .setPrice(parseFloat(data["Price"]))
            .setWeight(parseFloat(data["Weight"]))
            .setBatteryRequired(data["BatteryRequired"] === "true")
            .setDescription(data["Description"])
            .build();
    }
    reverseMap(data: Toy): { [key: string]: string } {
        return {
            Name: data.getName(),
            Brand: data.getBrand(),
            Type: data.getType(),
            Material: data.getMaterial(),
            Color: data.getColor(),
            AgeRecommendation: data.getAgeRecommendation(),
            Price: data.getPrice().toString(),
            Weight: data.getWeight().toString(),
            BatteryRequired: data.isBatteryRequired().toString(),
            Description: data.getDescription()
        };
    }
}

// psql
export interface psToy {
    orderid: string;
    name: string;
    brand: string;
    type: string;
    material: string;
    color: string;
    agerecommendation: string;
    price: number;
    weight: number;
    batteryrequired: boolean;
    description: string;
}

export class psToyMapper implements IMapper<psToy, IdentifiedToy> {

    map(data: psToy): IdentifiedToy {
        return IdentifiableToyBuilder.newBuilder().setToy(
            ToyBuilder.newBuilder()
                .setName(data.name)
                .setBrand(data.brand)
                .setType(data.type)
                .setMaterial(data.material)
                .setColor(data.color)
                .setAgeRecommendation(data.agerecommendation)
                .setPrice(data.price)
                .setWeight(data.weight)
                .setBatteryRequired(data.batteryrequired)
                .setDescription(data.description)
                .build()
        )
            .setId(data.orderid)
            .build();
    }

    reverseMap(data: Toy): psToy {
        throw new Error("Method not implemented.");
    }
}