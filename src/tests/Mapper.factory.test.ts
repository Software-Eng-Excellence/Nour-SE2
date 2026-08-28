import { MapperFactory } from "../mapper/Mapper.factory";
import {CSVCakeMapper,SQLiteCakeMapper,psCakeMapper} from "../mapper/Cake.mapper";
import {JSONBookMapper,psBookMapper} from "../mapper/Book.mapper";
import {XMLToyMapper,psToyMapper} from "../mapper/Toy.mapper";
import { DBMode } from "../model/DBModes.model";
import { ItemCategory } from "../model/IItem";

describe("MapperFactory", () => {

    it("should create the correct Cake FILE mapper", () => {
        const mapper = MapperFactory.create(DBMode.FILE,ItemCategory.CAKE);
        expect(mapper).toBeInstanceOf(CSVCakeMapper);
    });

    it("should create the correct Cake SQLITE mapper", () => {
        const mapper = MapperFactory.create(DBMode.SQLITE,ItemCategory.CAKE);
        expect(mapper).toBeInstanceOf(SQLiteCakeMapper);
    });

    it("should create the correct Cake PostgreSQL mapper", () => {
        const mapper = MapperFactory.create(DBMode.POSTGRESQL,ItemCategory.CAKE);
        expect(mapper).toBeInstanceOf(psCakeMapper);
    });

    it("should create the correct Book FILE mapper", () => {
        const mapper = MapperFactory.create(DBMode.FILE,ItemCategory.BOOK);
        expect(mapper).toBeInstanceOf(JSONBookMapper);
    });

    it("should create the correct Book PostgreSQL mapper", () => {
        const mapper = MapperFactory.create(DBMode.POSTGRESQL,ItemCategory.BOOK);
        expect(mapper).toBeInstanceOf(psBookMapper);
    });

    it("should create the correct Toy FILE mapper", () => {
        const mapper = MapperFactory.create(DBMode.FILE,ItemCategory.TOY);
        expect(mapper).toBeInstanceOf(XMLToyMapper);
    });

    it("should create the correct Toy PostgreSQL mapper", () => {
        const mapper = MapperFactory.create(DBMode.POSTGRESQL,ItemCategory.TOY);
        expect(mapper).toBeInstanceOf(psToyMapper);
    });

    it("should reject unsupported Book SQLITE mapper", () => {
        expect(() =>MapperFactory.create(DBMode.SQLITE,ItemCategory.BOOK)).toThrow("Unsupported database mode");
    });

    it("should reject unsupported Toy SQLITE mapper", () => {
        expect(() => MapperFactory.create(DBMode.SQLITE,ItemCategory.TOY)).toThrow("Unsupported database mode");
    });
});