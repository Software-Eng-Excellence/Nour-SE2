import { CSVCakeMapper } from "../mapper/Cake.mapper";

describe("CSVCakeMapper", () => {

    let mapper: CSVCakeMapper;

    beforeAll(() => {
        mapper = new CSVCakeMapper();
    });

    it("Map Successfully", () => {

        const cake = [
            "",
            "Birthday",
            "Chocolate",
            "Vanilla",
            "2",
            "3",
            "Buttercream",
            "Chocolate",
            "Flowers",
            "Pink",
            "Happy Birthday",
            "Round",
            "Nuts",
            "Strawberries",
            "Box"
        ];

        const mappedCake = mapper.map(cake);

        expect(mappedCake.getType()).toBe("Birthday");
        expect(mappedCake.getFlavor()).toBe("Chocolate");
    });

    it("throws error if a field is missing", () => {

        const cake = [
            "",
            "Birthday"
        ];

        expect(() => mapper.map(cake))
            .toThrow("Missing required properties");
    });
});