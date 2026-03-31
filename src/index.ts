import logger from "./util/logger";
import { CakeOrderRepository } from "./repository/file/Cake.order.repository";
import config from "./config";


async function main() {
const path = config.storagePath.csv.cake;
const repository = new CakeOrderRepository(path);
const data = await repository.get("17");
logger.info("List of orders:\n %o", data);

}

main();