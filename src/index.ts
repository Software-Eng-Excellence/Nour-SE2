import { CakeBuilder, IdentifiableCakeBuilder } from "./model/builders/cake.builder";
import { BookBuilder, IdentifiableBookBuilder } from "./model/builders/book.builder";
import { ToyBuilder, IdentifiableToyBuilder } from "./model/builders/toy.builder";
import { IdentifiableOrderItemBuilder,OrderBuilder } from "./model/builders/order.builder";
import { psOrderRepository } from "../src/repository/psql/order.repository";
import { psCakeOrderRepository } from "../src/repository/psql/cake.order.repository";
import { psBookOrderRepository } from "../src/repository/psql/book.order.repository";
import { psToyOrderRepository } from "../src/repository/psql/toy.order.repository";

// PostgreSQL
async function PSSandbox(): Promise<void> {

    try {
        // Cake Order
        console.log("\n Cake Order: ");
        const psCakeOrder = new psOrderRepository( new psCakeOrderRepository());
        await psCakeOrder.init();

        const cake = CakeBuilder.newBuilder()
                    .setType("Birthday")
                    .setFlavor("Chocolate")
                    .setFilling("Vanilla Cream")
                    .setSize(8)
                    .setLayers(3)
                    .setFrostingType("Buttercream")
                    .setFrostingFlavor("Chocolate")
                    .setDecorationType("Sprinkles")
                    .setDecorationColor("Blue")
                    .setCustomMessage("Happy Birthday!")
                    .setShape("Round")
                    .setAllergies("Nuts")
                    .setSpecialIngredients("Organic Cocoa")
                    .setPackagingType("Box")
                    .build();

        const cakeId = Math.floor(Math.random() * 100000).toString();
        const idCake = IdentifiableCakeBuilder.newBuilder()
                    .setID(cakeId)
                    .setCake(cake)
                    .build();

        const orderId = Math.floor(Math.random() * 100000).toString();
        const order = OrderBuilder.newBuilder()
                    .setItem(idCake)
                    .setId(orderId)
                    .setPrice(50)
                    .setQuantity(2)
                    .build();

        const idOrder = IdentifiableOrderItemBuilder.newBuilder()
                        .setItem(idCake)
                        .setOrder(order)
                        .build();

        await psCakeOrder.create(idOrder);
        console.log("Cake order created");

        const cakeOrder = await psCakeOrder.get(orderId);
        console.log("Cake order retrieved:",cakeOrder.getID());

        const allCakeOrders = await psCakeOrder.getAll();
        console.log("Total cake orders:",allCakeOrders.length);

        await psCakeOrder.delete(cakeOrder);

        // Book Order
        console.log("\n Book Order: ");

        const psBookOrder = new psOrderRepository(new psBookOrderRepository());
        await psBookOrder.init();
        console.log("Book Order repository initialized");

        const book = BookBuilder.newBuilder()
                    .setTitle("Design Patterns")
                    .setAuthor("Richard Helm")
                    .setGenre("Computer Science")
                    .setLanguage("English")
                    .setPublisher("Addison-Wesley Professional")
                    .setPublicationYear(1994)
                    .setIsbn("9780201633610")
                    .setNumberOfPages(395)
                    .setFormat("Hardcover")
                    .setDescription("A foundational text introducing software design patterns.")
                    .build();

        const bookId = Math.floor(Math.random() * 100000).toString();
        const idBook = IdentifiableBookBuilder.newBuilder()
                    .setId(bookId)
                    .setBook(book)
                    .build();

        const bookOrderId = Math.floor(Math.random() * 100000).toString();
        const bookOrder = OrderBuilder.newBuilder()
                        .setItem(idBook)
                        .setId(bookOrderId)
                        .setPrice(50)
                        .setQuantity(2)
                        .build();

        const idBookOrder = IdentifiableOrderItemBuilder.newBuilder()
                            .setItem(idBook)
                            .setOrder(bookOrder)
                            .build();

        await psBookOrder.create(idBookOrder);
        console.log("Book order created");

        const retrievedBookOrder = await psBookOrder.get(bookOrderId);
        console.log("Book order retrieved:",retrievedBookOrder.getID());

        const allBookOrders = await psBookOrder.getAll();
        console.log("Total book orders:",allBookOrders.length);

        await psBookOrder.delete( retrievedBookOrder);

        // Toy Order
        console.log("\n Toy Order: ");

        const psToyOrder = new psOrderRepository( new psToyOrderRepository());
        await psToyOrder.init();
        console.log("Toy Order repository initialized");

        const toy = ToyBuilder.newBuilder()
                    .setName("Remote Car")
                    .setBrand("TBrand")
                    .setType("Vehicle")
                    .setMaterial("Plastic")
                    .setColor("Black")
                    .setAgeRecommendation("3+")
                    .setPrice(35.5)
                    .setWeight(1.2)
                    .setBatteryRequired(true)
                    .setDescription("Remote controlled toy car.")
                    .build();

        const toyId = Math.floor(Math.random() * 100000).toString();
        const idToy = IdentifiableToyBuilder.newBuilder()
                    .setId(toyId)
                    .setToy(toy)
                    .build();

        const toyOrderId = Math.floor(Math.random() * 100000).toString();
        const toyOrder = OrderBuilder.newBuilder()
                        .setItem(idToy)
                        .setId(toyOrderId)
                        .setPrice(50)
                        .setQuantity(2)
                        .build();

        const idToyOrder = IdentifiableOrderItemBuilder.newBuilder()
                        .setItem(idToy)
                        .setOrder(toyOrder)
                        .build();

        await psToyOrder.create(idToyOrder);
        console.log("Toy order created");

        const retrievedToyOrder = await psToyOrder.get(toyOrderId);
        console.log( "Toy order retrieved:", retrievedToyOrder.getID());

        const allToyOrders = await psToyOrder.getAll();
        console.log( "Total toy orders:",allToyOrders.length);

        await psToyOrder.delete( retrievedToyOrder);

        console.log("\n PostgreSQL Test Completed Successfully");

    } catch (error) {

        console.error("\n PostgreSQL test failed");

        if (error instanceof Error) {
            console.error(error.message);
            console.error(error.stack);
        } else {
            console.error(error);
        }
    }
}

PSSandbox();