import { BookBuilder } from "../model/builders/book.builder";
import { Book } from "../model/Book.model";
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
}