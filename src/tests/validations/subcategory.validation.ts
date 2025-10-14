import { Subcategory } from "src/subcategory/entities/subcategory.entity";
import { expectOneOfTypes } from "../helpers/except-one-of-types.helper";
import { validateCategory } from "./category.validate";
import { validateProduct } from "./product.validate";

export function validateSubcategory(subcategory: Subcategory) {
	expectOneOfTypes(subcategory.id, [Number]),
		expectOneOfTypes(subcategory.name, [String]),
		expectOneOfTypes(subcategory.description, [String, "null"]),
		expectOneOfTypes(subcategory.image, [String, "null"]),
		expectOneOfTypes(subcategory.enabled, [Boolean]),
		expectOneOfTypes(subcategory.deletedAt, [String, "null"]);
	if (subcategory.category) validateCategory(subcategory.category);
	subcategory.products?.forEach(validateProduct);
}
