import { MenuPalette } from "src/palette/entities/menu-palette.entity";
import { expectOneOfTypes } from "../helpers/except-one-of-types.helper";

export function validateMenuPalette(menuPalette: MenuPalette) {
	expectOneOfTypes(menuPalette.id, [Number]);
	expectOneOfTypes(menuPalette.color1, [String]);
	expectOneOfTypes(menuPalette.color2, [String]);
	expectOneOfTypes(menuPalette.color3, [String]);
	expectOneOfTypes(menuPalette.enabled, [Boolean]);
	expectOneOfTypes(menuPalette.createdAt, [String]);
	expectOneOfTypes(menuPalette.updatedAt, [String, "undefined"]);
	expectOneOfTypes(menuPalette.deletedAt, [String, "null"]);
}
