import logger from "./util/logger";
import { CakeOrderRepository } from "./repository/file/Cake.order.repository";
import config from "./config";

import { OrderRepository } from "./repository/sqlite/Order.repository";
import { CakeRepository } from "./repository/sqlite/Cake.order.repository";
import { CakeBuilder, IdentifiableCakeBuilder } from "./model/builders/cake.builder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "./model/builders/order.builder";


async function main() {
const path = config.storagePath.csv.cake;
const repository = new CakeOrderRepository(path);
const data = await repository.get("17");
logger.info("List of orders:\n %o", data);

}


async function DBSandBox() {
    
    const dbOrder = new OrderRepository(new CakeRepository());
    await dbOrder.init();

    // create identifiable cake
    const cake = CakeBuilder.newBuilder()
        .setType("Birthday")
        .setFlavor("Chocolate")
        .setFilling("Cream")
        .setSize(8)
        .setLayers(2)
        .setFrostingType("Buttercream")
        .setFrostingFlavor("Vanilla")
        .setDecorationType("Sprinkles")
        .setDecorationColor("Rainbow")
        .setCustomMessage("Happy Birthday!")
        .setShape("Round")
        .setAllergies("None")
        .setSpecialIngredients("None")
        .setPackagingType("Box")
        .build();

    const idCake = IdentifiableCakeBuilder.newBuilder().setID(Math.random().toString(36).substring(2, 15)).setCake(cake).build();

    // create identifiable order
    const order = OrderBuilder.newBuilder().setItem(cake).setPrice(100).setQuantity(1).setId(Math.random().toString(36).substring(2, 15)).build();

    const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItem(idCake).setOrder(order).build();

    await dbOrder.create(idOrder);

    await dbOrder.delete(idOrder.getID());
    await dbOrder.update(idOrder);
    
    console.log((await dbOrder.getAll()).length);

}

// main();

DBSandBox();