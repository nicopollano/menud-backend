import { INestApplication } from "@nestjs/common";
import { before } from "node:test";
import { validateCategory } from "src/tests/validations/category.validate";
import { validateProduct } from "src/tests/validations/product.validate";
import request from "supertest";

export default function runProductTests(getApp: () => INestApplication) {
	describe("Product Tests", () => {
		let app: INestApplication;

		beforeAll(async () => {
			app = getApp();
		});

		it("[PRODUCT] POST - create", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .post(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/products`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .field("name", "product-testing")
            .field("price", "1500")
            .field("enabled", "false")
            .field("files", JSON.stringify(["avion", "combustible"]))
            .expect(201);

			validateProduct(response.body.data);

			globalThis.product = response.body.data;
		});

		it("[PRODUCT] PATCH - update", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .patch(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/products/${globalThis.product.id}`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .field("name", "product-testing-cocos")
            .field("price", "6000")
            .field("enabled", "true")
            .expect(200);

			validateProduct(response.body.data);

			expect(response.body.data).toMatchObject({
				enabled: true,
				name: "product-testing-cocos",
				price: 6000,
			});

			globalThis.product = response.body.data;
		});

		it("[PRODUCT] GET - findOne", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .get(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/products/${globalThis.product.id}`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .expect(200);
			validateProduct(response.body.data);
		});

		it("[PRODUCT] GET - findAll", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .get(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/products`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .expect(200);

			for (const item of response.body.data) validateProduct(item);

			const productExists = response.body.data?.find((_product) => _product.id == globalThis.product.id);

			if (!productExists) return false;
		});

		it("[PRODUCT] PATCH - update category", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .patch(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/products/${globalThis.product.id}`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .field("name", "product-testing-cocos")
            .field("price", "6000")
            .field("enabled", "true")
            .field("categoryId", `${globalThis.category.id}`)
            .expect(200);

			validateProduct(response.body.data);

			expect(response.body.data).toMatchObject({
				enabled: true,
				name: "product-testing-cocos",
				price: 6000,
				categories: expect.arrayContaining([
					expect.objectContaining({
						id: globalThis.category.id,
					}),
				]),
			});
		});

		it("[PRODUCT] PATCH - update subcategory", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .patch(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/products/${globalThis.product.id}`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .field("name", "product-testing-cocos")
            .field("price", "6000")
            .field("enabled", "true")
            .field("categoryId", `${globalThis.category.id}`)
            .field("subcategoryId", `${globalThis.subcategory.id}`)
            .expect(200);

			validateProduct(response.body.data);

			expect(response.body.data).toMatchObject({
				enabled: true,
				name: "product-testing-cocos",
				price: 6000,
				categories: expect.arrayContaining([
					expect.objectContaining({
						id: globalThis.category.id,
					}),
				]),
				subcategories: expect.arrayContaining([
					expect.objectContaining({
						id: globalThis.subcategory.id,
					}),
				]),
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
				products: expect.arrayContaining([
					expect.objectContaining({
						id: globalThis.product.id,
					}),
				]),
				subcategories: expect.arrayContaining([
					expect.objectContaining({
						id: globalThis.subcategory.id,
					}),
				]),
			});
		});
	});
}
