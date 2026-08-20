import { ItemCategory } from "../model/IItem";
import { DMmode } from "../repository/Repository.factory";
import { IMapper } from "./IMapper";
import {CSVCakeMapper,SQLiteCakeMapper,psCakeMapper} from "./Cake.mapper";
import {JSONBookMapper,psBookMapper} from "./Book.mapper";
import {XMLToyMapper,psToyMapper} from "./Toy.mapper";

export class MapperFactory {
    public static create(mode: DMmode,category: ItemCategory): IMapper<any, any> {

        switch (category) {
            case ItemCategory.CAKE:
                switch (mode) {
                    case DMmode.FILE:
                        return new CSVCakeMapper();
                    case DMmode.SQLITE:
                        return new SQLiteCakeMapper();
                    case DMmode.POSTGRESQL:
                        return new psCakeMapper();
                    default:
                        throw new Error("Unsupported database mode");
                }
            case ItemCategory.BOOK:
                switch (mode) {
                    case DMmode.FILE:
                        return new JSONBookMapper();
                    case DMmode.POSTGRESQL:
                        return new psBookMapper();
                    default:
                        throw new Error("Unsupported database mode");
                }
            case ItemCategory.TOY:
                switch (mode) {
                    case DMmode.FILE:
                        return new XMLToyMapper();
                    case DMmode.POSTGRESQL:
                        return new psToyMapper();
                    default:
                        throw new Error("Unsupported database mode");
                }
            default:
                throw new Error("Unsupported category");
        }
    }
}