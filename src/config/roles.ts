
export enum ROLE{
    admin="admin",
    manager="manager",
    user="user",
    guest="guest"
}

export enum Permission {
    create_order="create order",
    update_order="update order",
    delete_order="delete order",
    read_order="read order",
    create_user="create user",
    update_user="update user",
    delete_user="delete user",
    read_user="read user",
    login="login",
    logout="logout",
}

export type RolePermission ={
    [key in ROLE]:Permission[]
}

export const rolePermission : RolePermission ={
    [ROLE.admin]:[
        ...Object.values(Permission),
    ],
    [ROLE.manager]:[
        Permission.create_order,
        Permission.update_order,
        Permission.delete_order,
        Permission.read_order,
        Permission.read_user
    ],
    [ROLE.user]:[
        Permission.create_order,
        Permission.update_order,
        Permission.delete_order,
        Permission.create_user,
        Permission.update_user,
        Permission.delete_user,
        Permission.login,
        Permission.logout
    ],
    [ROLE.guest]:[
        Permission.create_user,
        Permission.read_order,
        Permission.login
    ]

}

export const toRole = (role:string): ROLE =>{
    switch(role){
        case ROLE.admin:
            return ROLE.admin;
        case ROLE.manager:
            return ROLE.manager;
        case ROLE.user:
            return ROLE.user;
        case ROLE.guest:
            return ROLE.guest;
        default:
            throw new Error('Invalid role');
    }
}