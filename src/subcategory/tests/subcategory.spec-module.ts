import { INestApplication } from "@nestjs/common";
import { before } from "node:test";
import { validateSubcategory } from "src/tests/validations/subcategory.validation";
import request from "supertest";

export default function runSubcategoryTests(getApp: () => INestApplication) {
	describe("Subcategory Tests", () => {
		let app: INestApplication;

		beforeAll(async () => {
			app = getApp();
		});

		it("[SUBCATEGORY] POST - create", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                    .post(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/subcategories`)
                    .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                    .field("name", "subcategory-testing")
                    .field("categoryId", globalThis.category.id)
                    .expect(201);

			validateSubcategory(response.body.data);

			globalThis.subcategory = response.body.data;
		});

		it("[SUBCATEGORY] PATCH - update", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                    .patch(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/subcategories/${globalThis.subcategory.id}`)
                    .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                    .field("enabled", !globalThis.subcategory.enabled)
                    .field("description", "coco moyo")
                    .field("name", "cacao")
                    .expect(200);

			validateSubcategory(response.body.data);

			expect(response.body.data).toMatchObject({
				enabled: !globalThis.category.enabled,
				description: "coco moyo",
				name: "cacao",
			});

			globalThis.subcategory = response.body.data;
		});

		it("[SUBCATEGORY] GET - findOne", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                    .get(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/subcategories/${globalThis.subcategory.id}`)
                    .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                    .expect(200);

			validateSubcategory(response.body.data);

			expect(response.body.data).toMatchObject({
				id: globalThis.subcategory.id,
				category: expect.objectContaining({
					id: globalThis.category.id,
				}),
			});
		});

		it("[SUBCATEGORY] GET - findAll", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                    .get(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/subcategories`)
                    .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                    .expect(200);

			for (const item of response.body.data) validateSubcategory(item);

			const subcategoryExists = response.body.data?.find((_subcategory) => _subcategory.id == globalThis.subcategory.id);

			if (!subcategoryExists) return false;
		});
	});
}
