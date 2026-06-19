
export interface IItem {
    getCategory(): ItemCategory;
}
export enum ItemCategory {
 CAKE = "cake"
 ,BOOK = "book"
 ,TOY = "toy"
}