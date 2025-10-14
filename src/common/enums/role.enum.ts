export const RoleList = [
	{ key: "superAdmin", description: "", value: 0 },
	{ key: "owner", description: "", value: 1 },
	{ key: "manager", description: "", value: 2 },
	{ key: "employer", description: "", value: 3 },
	{ key: "client", description: "", value: 4 },
	{ key: "viewer", description: "", value: 5 },
	{ key: "any", description: "", value: 6 },
] as const;

export type RoleKey = (typeof RoleList)[number]["key"];

export const RoleEnum = RoleList.reduce(
	(acc, role) => {
		acc[role.key] = role.key;
		return acc;
	},
	{} as Record<RoleKey, string>,
);
