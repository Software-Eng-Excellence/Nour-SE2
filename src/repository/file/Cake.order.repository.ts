import { IOrder } from "../../model/IOrder";
import { OrderRepository } from "./Order.repository";
import {readCSVFile, writeCsvFile } from "../../util/parser";
import { CSVOrderMapper } from "../../mapper/Order.mapper";
import { CSVCakeMapper } from "../../mapper/Cake.mapper";

export class CakeOrderRepository extends OrderRepository {
  private mapper = new CSVOrderMapper(new CSVCakeMapper());
  constructor(private readonly filePath:string) {
    super();
  }
  async load(): Promise<IOrder[]> {
    const csv = await readCSVFile(this.filePath);
    return csv.map(this.mapper.map.bind(this.mapper));
    }

  async save(orders: IOrder[]): Promise<void> {
    const header = [
        "id", "Type", "Flavor", "Filling", "Size", "Layers",
        "Frosting Type", "Frosting Flavor", "Decoration Type",
        "Decoration Color", "Custom Message", "Shape", "Allergies",
        "Special Ingredients", "Packaging Type", "Price", "Quantity"
    ];
    const rawItems = orders.map(this.mapper.reverseMap.bind(this.mapper));
    await writeCsvFile(this.filePath, [header, ...rawItems]);
   }
}