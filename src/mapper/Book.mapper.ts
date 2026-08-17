import { BookBuilder, IdentifiableBookBuilder } from "../model/builders/book.builder";
import { Book, IdentifiedBook } from "../model/Book.model";
import { IMapper } from "./IMapper";

export class JSONBookMapper implements IMapper<{ [key: string]: string }, Book> {
    map(data: { [key: string]: string }): Book {
        return BookBuilder.newBuilder()
            .setTitle(data["Title"])
            .setAuthor(data["Author"])
            .setGenre(data["Genre"])
            .setLanguage(data["Language"])
            .setPublisher(data["Publisher"])
            .setPublicationYear(parseInt(data["Publication Year"]))
            .setIsbn(data["ISBN"])
            .setNumberOfPages(parseInt(data["Number of Pages"]))
            .setFormat(data["Format"])
            .setDescription(data["Description"])
            .build()
    }
    reverseMap(data: Book): { [key: string]: string } {
        return {
            Title: data.getTitle(),
            Author: data.getAuthor(),
            Genre: data.getGenre(),
            Language: data.getLanguage(),
            Publisher: data.getPublisher(),
            "Publication Year": data.getPublicationYear().toString(),
            ISBN: data.getIsbn(),
            "Number of Pages": data.getNumberOfPages().toString(),
            Format: data.getFormat(),
            Description: data.getDescription()
        };
    }
}

// psql
export interface psBook {
    orderid: string;
    title: string;
    author: string;
    genre: string;
    language: string;
    publisher: string;
    publicationyear: number;
    isbn: string;
    numberofpages: number;
    format: string;
    description: string;
}

export class psBookMapper implements IMapper<psBook, IdentifiedBook> {

    map(data: psBook): IdentifiedBook {
        return IdentifiableBookBuilder.newBuilder().setBook(
         BookBuilder.newBuilder()
            .setTitle(data.title)
            .setAuthor(data.author)
            .setGenre(data.genre)
            .setFormat(data.format)
            .setLanguage(data.language)
            .setPublisher(data.publisher)
            .setPublicationYear(data.publicationyear)
            .setIsbn(data.isbn)
            .setNumberOfPages(data.numberofpages)
            .setDescription(data.description)
            .build())
            .setId(data.orderid)
            .build();
    }

    reverseMap(data: IdentifiedBook): psBook {
        throw new Error("Method not implemented.");
    }
}