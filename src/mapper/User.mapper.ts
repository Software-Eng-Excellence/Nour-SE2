import { User } from "../model/User.model";
import { IMapper } from "./IMapper";
import { UserBuilder } from "../model/builders/user.builder";

export interface SQLiteUser {
    id: string;
    name: string;
    email: string;
    password: string;
}

export class UserMapper implements IMapper<SQLiteUser, User> {

    map(data: SQLiteUser): User {
        return UserBuilder.create()
            .setId(data.id)
            .setName(data.name)
            .setEmail(data.email)
            .setPassword(data.password)
            .build();
    }

    reverseMap(data: User): SQLiteUser {
        return {
            id: data.getId(),
            name: data.getName(),
            email: data.getEmail(),
            password: data.getPassword()
        }
    }
}