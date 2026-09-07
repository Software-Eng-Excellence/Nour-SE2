import { createUserRepo, UserRepository } from "../repository/sqlite/User.repository";
import { User } from "../model/User.model";
import { id, InitializableRepository } from "../repository/IRepository";

export class UserService {
    private userRepository?: InitializableRepository<User>;

    async init(): Promise<void> {
        return (await this.getRepo()).init();
    }

    async createUser(user: User): Promise<id> {
        return (await this.getRepo()).create(user);
    }

    async getUserById(userId: id): Promise<User> {
        return (await this.getRepo()).get(userId);
    }

    async getAllUsers(): Promise<User[]> {
        return (await this.getRepo()).getAll();
    }

    async updateUser(user: User): Promise<void> {
        return (await this.getRepo()).update(user);
    }

    async deleteUser(user: User): Promise<void> {
        return (await this.getRepo()).delete(user);
    }

    private async getRepo() {
        if (!this.userRepository) {
            this.userRepository = await createUserRepo();
        }
        return this.userRepository;
    }
}