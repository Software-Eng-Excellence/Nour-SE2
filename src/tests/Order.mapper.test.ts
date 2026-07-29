import { CSVOrderMapper } from "../mapper/Order.mapper";
import { IMapper } from "../mapper/IMapper";

describe("CSVOrderMapper", () => {

    let mapper: CSVOrderMapper;

    beforeAll(() => {

        const mockItemMapper: IMapper<string[], any> = {
            map: jest.fn().mockReturnValue({
                getType: () => "Birthday Cake"
            }),

            reverseMap: jest.fn().mockReturnValue([
                "Birthday",
                "Chocolate",
                "Filling",
                "2",
                "3",
                "Buttercream",
                "Chocolate",
                "Flowers",
                "Pink",
                "Message",
                "Round",
                "None",
                "None",
                "Box"
            ])
        };

        mapper = new CSVOrderMapper(mockItemMapper);
    });

    it("Map Successfully", () => {

        const order = [
            "1001",
            "Birthday",
            "Chocolate",
            "Filling",
            "2",
            "3",
            "Buttercream",
            "Chocolate",
            "Flowers",
            "Pink",
            "Message",
            "Round",
            "None",
            "None",
            "Box",
            "100",
            "2"
        ];

        const mappedOrder = mapper.map(order);

        expect(mappedOrder.getID()).toBe("1001");
        expect(mappedOrder.getPrice()).toBe(100);
        expect(mappedOrder.getQuantity()).toBe(2);
    });

    it("throws error if a field is missing", () => {

        const order = [
            "1001"
        ];

        expect(() => mapper.map(order))
            .toThrow("Missing required fields to build Order");
    });

    it("Reverse Map Successfully", () => {

        const mockOrder = {
            getID: jest.fn().mockReturnValue("1001"),
            getPrice: jest.fn().mockReturnValue(100),
            getQuantity: jest.fn().mockReturnValue(2),
            getItem: jest.fn().mockReturnValue({})
        };

        const result = mapper.reverseMap(mockOrder as any);

        expect(result).toEqual([
            "1001",
            "Birthday",
            "Chocolate",
            "Filling",
            "2",
            "3",
            "Buttercream",
            "Chocolate",
            "Flowers",
            "Pink",
            "Message",
            "Round",
            "None",
            "None",
            "Box",
            "100",
            "2"
        ]);
    });

});