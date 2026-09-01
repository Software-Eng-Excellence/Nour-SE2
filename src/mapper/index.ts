import { ItemCategory } from "../model/IItem";
import { JsonRequestOrderMapper } from "./Order.mapper";
import { JsonCakeRequestMapper } from "./Cake.mapper";

export class JsonRequestFactory {
    public static create(type: ItemCategory): JsonRequestOrderMapper {
        switch (type) {
            case ItemCategory.CAKE:
                return new JsonRequestOrderMapper(new JsonCakeRequestMapper());
            default:
                throw new Error(`No mapper found for category: ${type}`);
        }
    }
}