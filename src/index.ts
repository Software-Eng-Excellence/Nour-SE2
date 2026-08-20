import { MapperFactory } from "./mapper/Mapper.factory";
import {RepositoryFactory,DMmode} from "./repository/Repository.factory";
import { ItemCategory } from "./model/IItem";

async function main(){

    const cakeMapper = MapperFactory.create(DMmode.POSTGRESQL,ItemCategory.CAKE);
    console.log("Cake mapper:",cakeMapper.constructor.name);

    const bookMapper = MapperFactory.create(DMmode.POSTGRESQL,ItemCategory.BOOK);
    console.log("Book mapper:",bookMapper.constructor.name);

    const toyMapper = MapperFactory.create(DMmode.POSTGRESQL,ItemCategory.TOY);
    console.log("Toy mapper:",toyMapper.constructor.name);

    const cakeRepository = await RepositoryFactory.create(DMmode.POSTGRESQL,ItemCategory.CAKE);
    console.log( "Cake repository:",cakeRepository.constructor.name);

    const bookRepository = await RepositoryFactory.create(DMmode.POSTGRESQL,ItemCategory.BOOK);
    console.log("Book repository:",bookRepository.constructor.name);

    const toyRepository = await RepositoryFactory.create(DMmode.POSTGRESQL,ItemCategory.TOY);
    console.log("Toy repository:",toyRepository.constructor.name);
}
main()