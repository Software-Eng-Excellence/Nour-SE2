import { IOrder } from "../../model/IOrder";
import { OrderRepository } from "./Order.repository";
import {readCSVFile, writeCsvFile } from "../../util/parser";
import { CSVOrderMapper } from "../../mapper/Order.mapper";
import { CSVCakeMapper } from "../../mapper/Cake.mapper";
import { DbException } from "../../util/exceptions/ItemNotFoundException";

export class CakeOrderRepository extends OrderRepository {
  private mapper = new CSVOrderMapper(new CSVCakeMapper());
  constructor(private readonly filePath:string) {
    super();
  }
  protected async load(): Promise<IOrder[]> {
    try {
      const csv = await readCSVFile(this.filePath);
      return csv.map(this.mapper.map.bind(this.mapper));
    } catch (error) {
      throw new DbException("Failed to load orders from file: ", error as Error);
    }
    
  }

  protected async save(orders: IOrder[]): Promise<void> {
    try{
      const header = [
          "id", "Type", "Flavor", "Filling", "Size", "Layers",
          "Frosting Type", "Frosting Flavor", "Decoration Type",
          "Decoration Color", "Custom Message", "Shape", "Allergies",
          "Special Ingredients", "Packaging Type", "Price", "Quantity"
      ];
      const rawItems = orders.map(this.mapper.reverseMap.bind(this.mapper));
      await writeCsvFile(this.filePath, [header, ...rawItems]);
    } catch (error) {
      throw new DbException("Failed to save orders to file: ", error as Error);
    }
  }
}