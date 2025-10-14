import { INestApplication } from "@nestjs/common";
import { before } from "node:test";
import { validateCategory } from "src/tests/validations/category.validate";
import request from "supertest";

export default function runCategoryTests(getApp: () => INestApplication) {
	describe("Category Tests", () => {
		let app: INestApplication;

		beforeAll(async () => {
			app = getApp();
		});

		it("[CATEGORY] POST - create", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .post(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/categories`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .field("name", "category-testing")
            .field("menuId", globalThis.menu.id)
            .expect(201);

			validateCategory(response.body.data);

			globalThis.category = response.body.data;
		});

		it("[CATEGORY] PATCH - update", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                    .patch(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/categories/${globalThis.category.id}`)
                    .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                    .field("enabled", !globalThis.category.enabled)
                    .field("description", "coco moyo")
                    .field("name", "cacao")
                    .expect(200);

			validateCategory(response.body.data);

			expect(response.body.data).toMatchObject({
				enabled: !globalThis.category.enabled,
				description: "coco moyo",
				name: "cacao",
			});
		});

		it("[CATEGORY] GET - findOne", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                    .get(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/categories/${globalThis.category.id}`)
                    .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                    .field("name", "category-testing")
                    .field("menuId", globalThis.menu.id)
                    .expect(200);

			validateCategory(response.body.data);

			expect(response.body.data).toMatchObject({
				id: globalThis.category.id,
				products: expect.any(Array),
				subcategories: expect.any(Array),
			});
		});

		it("[CATEGORY] GET - findAll", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                    .get(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/categories`)
                    .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                    .field("name", "category-testing")
                    .field("menuId", globalThis.menu.id)
                    .expect(200);

			for (const item of response.body.data) validateCategory(item);

			const categoryExists = response.body.data.find((_category) => _category.id == globalThis.category.id);

			if (!categoryExists) return false;
		});
	});
}
