import { Branch } from "src/branch/entities/branch.entity";
import { expectOneOfTypes } from "../helpers/except-one-of-types.helper";

export function validateBranch(branch: Branch) {
	expectOneOfTypes(branch.id, [Number]),
		expectOneOfTypes(branch.address, [String, "null"]),
		expectOneOfTypes(branch.slug, [String]),
		expectOneOfTypes(branch.description, [String, "null"]),
		expectOneOfTypes(branch.logo, [String, "null"]),
		expectOneOfTypes(branch.phone, [String, "null"]),
		expectOneOfTypes(branch.location, [String, "null"]),
		expectOneOfTypes(branch.country, [String, "null"]),
		expectOneOfTypes(branch.currency, [String, "null"]),
		expectOneOfTypes(branch.enabled, [Boolean]),
		expectOneOfTypes(branch.createdAt, [String]),
		expectOneOfTypes(branch.deletedAt, [String, "null"]),
		expectOneOfTypes(branch.updatedAt, [String, "null"]),
		expectOneOfTypes(branch.summary?.totalMenus, [Number, "undefined"]);
}
