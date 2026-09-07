import { User } from "../../model/User.model";

export class UserBuilder {

    private id!: string;
    private name!: string;
    private email!: string;
    private password!: string;

    static create(): UserBuilder {
        return new UserBuilder();
    }

    setId(id: string): UserBuilder {
        this.id = id;
        return this;
    }

    setName(name: string): UserBuilder {
        this.name = name;
        return this;
    }

    setEmail(email: string): UserBuilder {
        this.email = email;
        return this;
    }

    setPassword(password: string): UserBuilder {
        this.password = password;
        return this;
    }

    build(): User {
        if (!this.id) {
            throw new Error("User id is required");
        }
        if (!this.name) {
            throw new Error("User name is required");
        }
        if (!this.email) {
            throw new Error("User email is required");
        }
        if (!this.password) {
            throw new Error("User password is required");
        }
        return new User(this.id, this.name, this.email, this.password);
    }
}