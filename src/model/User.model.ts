import { id, ID } from "../repository/IRepository";

export class User implements ID {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;

    constructor(id: string = '', name: string, email: string, password: string , role:string = 'user') {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    getID(): id {
        throw new Error("Method not implemented.");
    }

    getId(): id {
        return this.id;
    }
    getName(): string {
        return this.name;
    }
    getEmail(): string {
        return this.email;
    }
    getPassword(): string {
        return this.password;
    }
}