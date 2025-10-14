import { BasePermissionsDTO } from "src/permission/dtos/base-permission.dto";
import { ManagerPermissions } from "./business/generals/manager.permission";
import { OwnerPermissions } from "./business/generals/owner.permission";

export const GeneralsPermissionsList = [
    ManagerPermissions,
    OwnerPermissions
] as const;

export interface PermissionListInterface {
    role: string,
    permissions: BasePermissionsDTO[]
}