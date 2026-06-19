import { JSONBookMapper } from "../mapper/Book.mapper";

describe("JSONBookMapper", () => {

    let mapper: JSONBookMapper;

    beforeAll(() => {
        mapper = new JSONBookMapper();
    });

    it("Map Successfully", () => {

        const book = {
            Title: "KR7",
            Author: "Nour",
            Genre: "Action",
            Language: "English",
            Publisher: "Publisher",
            "Publication Year": "2026",
            ISBN: "123456",
            "Number of Pages": "300",
            Format: "Hardcover",
            Description: "Test Book"
};

        const mappedBook = mapper.map(book);

        expect(mappedBook.getTitle()).toBe("KR7");
        expect(mappedBook.getAuthor()).toBe("Nour");
    });

    it("throws error if a field is missing", () => {

        const book = {
            "Book Title": "CR7"
        };

        expect(() => mapper.map(book))
            .toThrow("Missing required properties");
    });
});