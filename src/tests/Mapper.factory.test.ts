import { MapperFactory } from "../mapper/Mapper.factory";
import {CSVCakeMapper,SQLiteCakeMapper,psCakeMapper} from "../mapper/Cake.mapper";
import {JSONBookMapper,psBookMapper} from "../mapper/Book.mapper";
import {XMLToyMapper,psToyMapper} from "../mapper/Toy.mapper";
import { DMmode } from "../repository/Repository.factory";
import { ItemCategory } from "../model/IItem";

describe("MapperFactory", () => {

    it("should create the correct Cake FILE mapper", () => {
        const mapper = MapperFactory.create(DMmode.FILE,ItemCategory.CAKE);
        expect(mapper).toBeInstanceOf(CSVCakeMapper);
    });

    it("should create the correct Cake SQLITE mapper", () => {
        const mapper = MapperFactory.create(DMmode.SQLITE,ItemCategory.CAKE);
        expect(mapper).toBeInstanceOf(SQLiteCakeMapper);
    });

    it("should create the correct Cake PostgreSQL mapper", () => {
        const mapper = MapperFactory.create(DMmode.POSTGRESQL,ItemCategory.CAKE);
        expect(mapper).toBeInstanceOf(psCakeMapper);
    });

    it("should create the correct Book FILE mapper", () => {
        const mapper = MapperFactory.create(DMmode.FILE,ItemCategory.BOOK);
        expect(mapper).toBeInstanceOf(JSONBookMapper);
    });

    it("should create the correct Book PostgreSQL mapper", () => {
        const mapper = MapperFactory.create(DMmode.POSTGRESQL,ItemCategory.BOOK);
        expect(mapper).toBeInstanceOf(psBookMapper);
    });

    it("should create the correct Toy FILE mapper", () => {
        const mapper = MapperFactory.create(DMmode.FILE,ItemCategory.TOY);
        expect(mapper).toBeInstanceOf(XMLToyMapper);
    });

    it("should create the correct Toy PostgreSQL mapper", () => {
        const mapper = MapperFactory.create(DMmode.POSTGRESQL,ItemCategory.TOY);
        expect(mapper).toBeInstanceOf(psToyMapper);
    });

    it("should reject unsupported Book SQLITE mapper", () => {
        expect(() =>MapperFactory.create(DMmode.SQLITE,ItemCategory.BOOK)).toThrow("Unsupported database mode");
    });

    it("should reject unsupported Toy SQLITE mapper", () => {
        expect(() => MapperFactory.create(DMmode.SQLITE,ItemCategory.TOY)).toThrow("Unsupported database mode");
    });
});