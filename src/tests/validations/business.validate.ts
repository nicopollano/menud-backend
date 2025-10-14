import { Business } from "src/business/entities/business.entity";
import { expectOneOfTypes } from "../helpers/except-one-of-types.helper";

export function validateBusiness(item: Business) {
	expect(item.id).toEqual(expect.any(Number));
	expect(item.name).toEqual(expect.any(String));
	expectOneOfTypes(item.logo, [String, "null"]);
	expectOneOfTypes(item.description, [String, "null"]);
	expectOneOfTypes(item.phone, [String, "null"]);
	expectOneOfTypes(item.address, [String, "null"]);
	expectOneOfTypes(item.location, [String, "null"]);
	expectOneOfTypes(item.country, [String, "null"]);
	expect(item.enabled).toEqual(expect.any(Boolean));
	expectOneOfTypes(item.deletedAt, [String, "null"]);
	expect(item.createdAt).toEqual(expect.any(String)); // ISO
	expect(item.updatedAt).toEqual(expect.any(String)); // ISO

	expectOneOfTypes(item.summary?.totalBranches, [Number, "undefined"]);
}
