import logger from "../../util/logger";
import { Book, IdentifiedBook } from "../Book.model";

export class BookBuilder {
    static create() {
        throw new Error("Method not implemented.");
    }

    private title!: string;
    private author!: string;
    private genre!: string;
    private language!: string;
    private publisher!: string;
    private publicationYear!: number;
    private isbn!: string;
    private numberOfPages!: number;
    private format!: string;
    private description!: string;

    public static newBuilder(): BookBuilder {
        return new BookBuilder();
    }

    setTitle(title: string): BookBuilder {
        this.title = title;
        return this;
    }

    setAuthor(author: string): BookBuilder {
        this.author = author;
        return this;
    }

    setGenre(genre: string): BookBuilder {
        this.genre = genre;
        return this;
    }

    setLanguage(language: string): BookBuilder {
        this.language = language;
        return this;
    }

    setPublisher(publisher: string): BookBuilder {
        this.publisher = publisher;
        return this;
    }

    setPublicationYear(publicationYear: number): BookBuilder {
        this.publicationYear = publicationYear;
        return this;
    }

    setIsbn(isbn: string): BookBuilder {
        this.isbn = isbn;
        return this;
    }

    setNumberOfPages(numberOfPages: number): BookBuilder {
        this.numberOfPages = numberOfPages;
        return this;
    }

    setFormat(format: string): BookBuilder {
        this.format = format;
        return this;
    }

    setDescription(description: string): BookBuilder {
        this.description = description;
        return this;
    }

    build(): Book {

        const requiredProperties = [
            this.title,
            this.author,
            this.genre,
            this.language,
            this.publisher,
            this.publicationYear,
            this.isbn,
            this.numberOfPages,
            this.format,
            this.description
        ];

        for (const property of requiredProperties) {
            if (property === undefined || property === null) {
                logger.error("Missing required properties, couldn't create a Book");
                throw new Error("Missing required properties");
            }
        }

        return new Book(
            this.title,
            this.author,
            this.genre,
            this.language,
            this.publisher,
            this.publicationYear,
            this.isbn,
            this.numberOfPages,
            this.format,
            this.description
        );
    }
}

export class IdentifiableBookBuilder{
    private id!: string;
    private book!: Book;

    static newBuilder(): IdentifiableBookBuilder{
        return new IdentifiableBookBuilder();
    }

    setId(id: string): IdentifiableBookBuilder {
        this.id = id;
        return this;
    }

    setBook(book: Book): IdentifiableBookBuilder {
        this.book = book;
        return this;
    }
    build(): IdentifiedBook {

        if (!this.id || !this.book) {
            logger.error("error missing identifiable book properties");
            throw new Error("Missing required properties")
        }
        return new IdentifiedBook(this.id,this.book.getTitle(),this.book.getAuthor(),this.book.getGenre(),this.book.getLanguage(),this.book.getPublisher(),this.book.getPublicationYear(),this.book.getIsbn(),this.book.getNumberOfPages(),this.book.getFormat(),this.book.getDescription())
    }
}