import { Menu } from "src/menu/entities/menu.entity";
import { expectOneOfTypes } from "../helpers/except-one-of-types.helper";
import { Category } from "src/category/entities/category.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { MenuPalette } from "src/palette/entities/menu-palette.entity";
import { validateCategory } from "./category.validate";
import { validateBranch } from "./branch.validation";
import { validateMenuPalette } from "./menu-palettes.validate";

export function validateMenu(menu: Menu) {
	expectOneOfTypes(menu.id, [Number]),
		expectOneOfTypes(menu.name, [String]),
		expectOneOfTypes(menu.description, [String, "undefined", "null"]),
		expectOneOfTypes(menu.logo, [String, "undefined", "null"]),
		expectOneOfTypes(menu.cover, [String, "undefined", "null"]),
		expectOneOfTypes(menu.typography, [String]),
		expectOneOfTypes(menu.enabled, [Boolean]),
		expectOneOfTypes(menu.updatedAt, [String, "undefined", "null"]),
		expectOneOfTypes(menu.createdAt, [String]),
		expectOneOfTypes(menu.summary?.totalCategories, [Number, "undefined"]),
		expectOneOfTypes(menu.summary?.totalProducts, [Number, "undefined"]),
		menu.categories?.forEach(validateCategory),
		validateBranch(menu.branch),
		menu.menuPalettes?.forEach(validateMenuPalette);
}
