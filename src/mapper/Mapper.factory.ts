import { ItemCategory } from "../model/IItem";
import { IMapper } from "./IMapper";
import {CSVCakeMapper,SQLiteCakeMapper,psCakeMapper} from "./Cake.mapper";
import {JSONBookMapper,psBookMapper} from "./Book.mapper";
import {XMLToyMapper,psToyMapper} from "./Toy.mapper";

import { DBMode } from "../config/types";

export class MapperFactory {
    public static create(mode: DBMode,category: ItemCategory): IMapper<any, any> {

        switch (category) {
            case ItemCategory.CAKE:
                switch (mode) {
                    case DBMode.FILE:
                        return new CSVCakeMapper();
                    case DBMode.SQLITE:
                        return new SQLiteCakeMapper();
                    case DBMode.POSTGRESQL:
                        return new psCakeMapper();
                    default:
                        throw new Error("Unsupported database mode");
                }
            case ItemCategory.BOOK:
                switch (mode) {
                    case DBMode.FILE:
                        return new JSONBookMapper();
                    case DBMode.POSTGRESQL:
                        return new psBookMapper();
                    default:
                        throw new Error("Unsupported database mode");
                }
            case ItemCategory.TOY:
                switch (mode) {
                    case DBMode.FILE:
                        return new XMLToyMapper();
                    case DBMode.POSTGRESQL:
                        return new psToyMapper();
                    default:
                        throw new Error("Unsupported database mode");
                }
            default:
                throw new Error("Unsupported category");
        }
    }
}