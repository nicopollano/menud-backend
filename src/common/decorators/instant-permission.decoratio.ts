import { ModuleEnum } from "../enums/modules.enum";
import { User } from "src/users/entities/user.entity";
import { Actions } from "../enums/actions.enum";
import { BasePermissionsDTO } from "src/permission/dtos/base-permission.dto";


export const ALL_PERMISSIONS = (module: ModuleEnum) => {
    const permission: BasePermissionsDTO = new BasePermissionsDTO();
    permission.module = module;
    permission.actions = [ 
        Actions.CREATE,
        Actions.UPDATE,
        Actions.DELETE,
        Actions.VIEW,
        Actions.LIST,
        Actions.SUMMARY,
    ]

    return permission;
}