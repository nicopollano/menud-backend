export enum ModuleEnum {
	BUSINESSES = "businesses",
	PRODUCTS = "products",
	CATEGORIES = "categories",
	SUBCATEGORIES = "subcategories",
	BRANCHES = "branches",
	MENUS = "menus",
	PROMOTIONS = "promotions",
	MEMBERS = "members",
	SCHEDULE = "schedule",
	PALETTES = "palettes",
	PROFILE = "profile",
	LINKITS = "linkits",
	PLANS = "plans",
}

export type ModuleKey = `${ModuleEnum}`;
