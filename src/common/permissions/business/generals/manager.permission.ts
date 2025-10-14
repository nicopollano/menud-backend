import { Actions } from "src/common/enums/actions.enum";
import { ModuleEnum } from "src/common/enums/modules.enum";
import { RoleEnum } from "src/common/enums/role.enum";
import { BasePermissionsDTO } from "src/permission/dtos/base-permission.dto";

export const ManagerPermissions = {
	role: RoleEnum.manager,
	permissions: [
		{
			module: ModuleEnum.BUSINESSES,
			actions: [Actions.LIST, Actions.VIEW],
		},
		{
			module: ModuleEnum.CATEGORIES,
			actions: [Actions.CREATE, Actions.DELETE, Actions.LIST, Actions.VIEW, Actions.UPDATE],
		},
		{
			module: ModuleEnum.SUBCATEGORIES,
			actions: [Actions.CREATE, Actions.DELETE, Actions.LIST, Actions.VIEW, Actions.UPDATE],
		},
		{
			module: ModuleEnum.PRODUCTS,
			actions: [Actions.CREATE, Actions.DELETE, Actions.LIST, Actions.VIEW, Actions.UPDATE],
		},
		{
			module: ModuleEnum.MENUS,
			actions: [Actions.CREATE, Actions.DELETE, Actions.LIST, Actions.VIEW, Actions.UPDATE, Actions.SUMMARY],
		},
		{
			module: ModuleEnum.PALETTES,
			actions: [Actions.CREATE, Actions.DELETE, Actions.LIST, Actions.VIEW, Actions.UPDATE],
		},
		{
			module: ModuleEnum.MEMBERS,
			actions: [Actions.CREATE, Actions.DELETE, Actions.LIST, Actions.VIEW, Actions.UPDATE],
		},
		{
			module: ModuleEnum.SCHEDULE,
			actions: [Actions.CREATE, Actions.DELETE, Actions.LIST, Actions.VIEW, Actions.UPDATE],
		},
		{
			module: ModuleEnum.PROMOTIONS,
			actions: [Actions.CREATE, Actions.DELETE, Actions.LIST, Actions.VIEW, Actions.UPDATE, Actions.SUMMARY, Actions.AVAILABLE_DAYS],
		},
		{
			module: ModuleEnum.BRANCHES,
			actions: [Actions.LIST, Actions.VIEW, Actions.SUMMARY, Actions.COPY, Actions.MOVE],
		},
		{
			module: ModuleEnum.LINKITS,
			actions: [Actions.LIST, Actions.VIEW, Actions.SUMMARY, Actions.UPDATE],
		},
	] as BasePermissionsDTO[],
} as const;
