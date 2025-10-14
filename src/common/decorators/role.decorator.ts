import { SetMetadata } from "@nestjs/common";
import { RoleKey } from "../enums/role.enum";

export const ROLE_KEY = "roles";
export const Roles = (...roles: RoleKey[]) => SetMetadata(ROLE_KEY, roles);
