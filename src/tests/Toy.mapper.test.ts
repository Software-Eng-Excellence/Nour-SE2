import { XMLToyMapper } from "../mapper/Toy.mapper";

describe("XMLToyMapper", () => {

    let mapper: XMLToyMapper;

    beforeAll(() => {
        mapper = new XMLToyMapper();
    });

    it("Map Successfully", () => {

        const toy = {
            Name: "Lego Set",
            Brand: "LEGO",
            Type: "Board Game",
            Material: "Plastic",
            Color: "Red",
            AgeRecommendation: "8+",
            Price: "247",
            Weight: "5",
            BatteryRequired: "true",
            Description: "Educational toy"
        };

        const mappedToy = mapper.map(toy);

        expect(mappedToy.getType()).toBe("Board Game");
        expect(mappedToy.getAgeRecommendation()).toBe("8+");
    });

    it("throws error if a field is missing", () => {

        const toy = {
            Type: "Board Game"
        };

        expect(() => mapper.map(toy))
            .toThrow("Missing required properties");
    });
});