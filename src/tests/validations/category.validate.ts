import { Category } from "src/category/entities/category.entity";
import { expectOneOfTypes } from "../helpers/except-one-of-types.helper";
import { validateProduct } from "./product.validate";
import { validateSubcategory } from "./subcategory.validation";

export function validateCategory(category: Category) {
	expectOneOfTypes(category.id, [Number]),
		expectOneOfTypes(category.name, [String]),
		expectOneOfTypes(category.description, [String, "null"]),
		expectOneOfTypes(category.enabled, [Boolean]),
		expectOneOfTypes(category.deletedAt, [String, "null"]),
		category.products?.forEach(validateProduct),
		category.subcategories?.forEach(validateSubcategory),
		expectOneOfTypes(category.summary?.totalProducts, [Number, "undefined"]),
		expectOneOfTypes(category.summary?.totalSubcategories, [Number, "undefined"]);
}
