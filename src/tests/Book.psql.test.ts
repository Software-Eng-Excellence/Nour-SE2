import { psBookOrderRepository } from "../repository/psql/book.order.repository";
import {BookBuilder,IdentifiableBookBuilder} from "../model/builders/book.builder";

jest.setTimeout(30000);

describe("PostgreSQL Book Repository", () => {

    let bookRepo: psBookOrderRepository;

    beforeAll(async () => {
        bookRepo = new psBookOrderRepository();
        await bookRepo.init();
    });

    it("should create a book and retrieve it", async () => {

        const bookId = Math.floor(Math.random() * 100000).toString();

        const book = IdentifiableBookBuilder.newBuilder()
            .setId(bookId)
            .setBook(
                BookBuilder.newBuilder()
                    .setTitle("Clean_Code")
                    .setAuthor("Robert C. Martin")
                    .setGenre("Programming")
                    .setLanguage("English")
                    .setPublisher("Prentice Hall")
                    .setPublicationYear(2008)
                    .setIsbn("9780132350884")
                    .setNumberOfPages(464)
                    .setFormat("Paperback")
                    .setDescription("A book about writing clean software.")
                    .build()
            )
            .build();

        const id = await bookRepo.create(book);

        expect(id).toBe(bookId);

        const data = await bookRepo.get(bookId);

        expect(data).toBeDefined();
        expect(data.getId()).toBe(bookId);
        expect(data.getTitle()).toBe("Clean_Code");
        expect(data.getAuthor()).toBe("Robert C. Martin");

        await bookRepo.delete(book);
    }, 30000);


    it("should update a book", async () => {

        const bookId = Math.floor(Math.random() * 100000).toString();

        const book = IdentifiableBookBuilder.newBuilder()
            .setId(bookId)
            .setBook(
                BookBuilder.newBuilder()
                    .setTitle("Original Book")
                    .setAuthor("Robert C. Martin")
                    .setGenre("Programming")
                    .setLanguage("English")
                    .setPublisher("Prentice Hall")
                    .setPublicationYear(2008)
                    .setIsbn("9780132350884")
                    .setNumberOfPages(464)
                    .setFormat("Paperback")
                    .setDescription("Original description")
                    .build()
            )
            .build();

        await bookRepo.create(book);

        const updatedBook = IdentifiableBookBuilder.newBuilder()
            .setId(bookId)
            .setBook(
                BookBuilder.newBuilder()
                    .setTitle("Updated Book")
                    .setAuthor(book.getAuthor())
                    .setGenre(book.getGenre())
                    .setLanguage("French")
                    .setPublisher(book.getPublisher())
                    .setPublicationYear(book.getPublicationYear())
                    .setIsbn(book.getIsbn())
                    .setNumberOfPages(book.getNumberOfPages())
                    .setFormat(book.getFormat())
                    .setDescription("Updated description")
                    .build()
            )
            .build();

        await bookRepo.update(updatedBook);

        const result = await bookRepo.get(bookId);

        expect(result.getTitle()).toBe("Updated Book");
        expect(result.getLanguage()).toBe("French");
        expect(result.getDescription()).toBe("Updated description");

        await bookRepo.delete(result);
    }, 30000);


    it("should delete a book", async () => {

        const bookId = Math.floor(Math.random() * 100000).toString();

        const book = IdentifiableBookBuilder.newBuilder()
            .setId(bookId)
            .setBook(
                BookBuilder.newBuilder()
                    .setTitle("Delete Book")
                    .setAuthor("Test Author")
                    .setGenre("Test Genre")
                    .setLanguage("English")
                    .setPublisher("Test Publisher")
                    .setPublicationYear(2020)
                    .setIsbn(`ISBN-${bookId}`)
                    .setNumberOfPages(100)
                    .setFormat("Paperback")
                    .setDescription("Book for delete test")
                    .build()
            )
            .build();

        await bookRepo.create(book);
        await bookRepo.delete(book);

        await expect( bookRepo.get(bookId)).rejects.toThrow();
    }, 30000);


    it("should get all books", async () => {

        const bookId1 = Math.floor(Math.random() * 100000).toString();
        const bookId2 = Math.floor(Math.random() * 100000).toString();

        const book1 = IdentifiableBookBuilder.newBuilder()
            .setId(bookId1)
            .setBook(
                BookBuilder.newBuilder()
                    .setTitle("Book One")
                    .setAuthor("Author One")
                    .setGenre("Programming")
                    .setLanguage("English")
                    .setPublisher("Publisher")
                    .setPublicationYear(2020)
                    .setIsbn(`ISBN-${bookId1}`)
                    .setNumberOfPages(100)
                    .setFormat("Paperback")
                    .setDescription("Book one")
                    .build()
            )
            .build();

        const book2 = IdentifiableBookBuilder.newBuilder()
            .setId(bookId2)
            .setBook(
                BookBuilder.newBuilder()
                    .setTitle("Book Two")
                    .setAuthor("Author Two")
                    .setGenre("Programming")
                    .setLanguage("English")
                    .setPublisher("Publisher")
                    .setPublicationYear(2021)
                    .setIsbn(`ISBN-${bookId2}`)
                    .setNumberOfPages(200)
                    .setFormat("Hardcover")
                    .setDescription("Book two")
                    .build()
            )
            .build();

        await bookRepo.create(book1);
        await bookRepo.create(book2);

        const books = await bookRepo.getAll();

        expect(Array.isArray(books)).toBe(true);

        expect(books.some(book => book.getId() === bookId1)).toBe(true);

        expect(books.some(book => book.getId() === bookId2)).toBe(true);

        await bookRepo.delete(book1);
        await bookRepo.delete(book2);
    }, 30000);


    it("should reject duplicate book ID", async () => {

        const bookId = Math.floor(Math.random() * 100000).toString();

        const book = IdentifiableBookBuilder.newBuilder()
            .setId(bookId)
            .setBook(
                BookBuilder.newBuilder()
                    .setTitle("Duplicate Book")
                    .setAuthor("Test Author")
                    .setGenre("Programming")
                    .setLanguage("English")
                    .setPublisher("Publisher")
                    .setPublicationYear(2020)
                    .setIsbn(`ISBN-${bookId}`)
                    .setNumberOfPages(100)
                    .setFormat("Paperback")
                    .setDescription("Duplicate test")
                    .build()
            )
            .build();

        await bookRepo.create(book);
        await expect(bookRepo.create(book)).rejects.toThrow();
        await bookRepo.delete(book);
    }, 30000);


    it("should throw when getting a non-existing book", async () => {

        const id = Math.floor(Math.random() * 100000).toString();

        await expect(bookRepo.get(id)).rejects.toThrow();
    }, 30000);


    it("should throw error on null book values", () => {

        expect(() => {
            BookBuilder.newBuilder()
                .setTitle(null as any)
                .setAuthor("Author")
                .setGenre("Programming")
                .setLanguage("English")
                .setPublisher("Publisher")
                .setPublicationYear(2020)
                .setIsbn("123456")
                .setNumberOfPages(100)
                .setFormat("Paperback")
                .setDescription("Description")
                .build();
        }).toThrow();
    });
});