import { Product } from "src/product/entities/product.entity";
import { expectOneOfTypes } from "../helpers/except-one-of-types.helper";
import { validateCategory } from "./category.validate";
import { validateSubcategory } from "./subcategory.validation";

export function validateProduct(product: Product) {
	expectOneOfTypes(product.id, [Number]);
	expectOneOfTypes(product.name, [String]);
	expectOneOfTypes(product.description, [String, "undefined", "null"]);
	product.images?.forEach((image) => expectOneOfTypes(image, [String]));
	product.categories?.forEach(validateCategory);
	product.subcategories?.forEach(validateSubcategory);
	expectOneOfTypes(product.discountedPrice, [Number]);
	expectOneOfTypes(product.sell_count, [Number]);
	expectOneOfTypes(product.enabled, [Boolean, "undefined"]);
	expectOneOfTypes(product.deletedAt, [String, "undefined", "null"]);
}
