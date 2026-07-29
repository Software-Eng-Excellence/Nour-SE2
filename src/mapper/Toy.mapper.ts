import { Toy } from "../model/Toy.model";
import { IMapper } from "./IMapper";
import { ToyBuilder } from "../model/builders/toy.builder";

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