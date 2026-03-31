
export type id = string;

export interface ID{
    getID(): id;
}

export interface IRepository<T extends ID> {

/**
 * Interface representing a generic repository interface for managing items of type T.
 * 
 * @template T - The type of item managed by the repository, which extend ID.
 */

    /**
     * Create a new item in the repository.

     * @param item - The item to be created.
     * @returns A promise that resolves to the ID of the created item. 
     * @throws {InvalidItemException} - Thrown when an invalid item is encountered.
     */ 
    create(item: T): Promise<id>;

    /**
     * Retrieve an item from the repository by its ID.
     * 
     * @param id -The ID of the item to be retrieved.
     * @return A promise that resolves to the item with the specified ID.
     * @throws {ItemNotFoundException} - Thrown when an item with the specified ID is not found.
     */ 
    
    get(id: id):Promise<T>;

    /**
     * 
     * Retrieve all items from the repository
     * 
     * @return A promise that resolves to an array of all items in the repository.
     */
    getAll(item: T): Promise<T []>;

    /**
     * Update an existing item in the repository.
     * 
     * @param item - The item to be updated.
     * @return A promise that resolves when the item is successfully updated.
     * @throws {ItemNotFoundException} - Thrown when an item to be updated is not found.
     * @throws {InvalidItemException} - Thrown when an invalid item is encountered.
     */
    update(item: T): Promise<void>;

    /**
     * Delete an item from the repository by its ID.
     * 
     * @param id -The item of the ID to be deleted 
     * @return A promise that resolves when the item is successfully deleted.
     * @throws {ItemNotFoundException} - Thrown when an item with the specified ID is not found.
     */
    delete(id: id): Promise<void>;
}