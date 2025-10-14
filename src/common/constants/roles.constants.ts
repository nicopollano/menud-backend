import { RoleKey, RoleList } from "../enums/role.enum";

export const RoleMap: Record<RoleKey, number> = RoleList.reduce(
	(acc, role) => {
		acc[role.key] = role.value;
		return acc;
	},
	{} as Record<RoleKey, number>,
);
