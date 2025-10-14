import { INestApplication } from "@nestjs/common";
import { before } from "node:test";
import request from "supertest";
import { validateBranch } from "./validations/branch.validation";
import { validateProduct } from "./validations/product.validate";
import { validateSubcategory } from "./validations/subcategory.validation";
import { validateMenu } from "./validations/menu.validate";
import { UsersService } from "src/users/users.service";

export default function runDeleteTests(getApp: () => INestApplication) {
	describe("Deleting Tests", () => {
		let app: INestApplication;

		beforeAll(async () => {
			app = getApp();
		});

		it("[PRODUCT] DELETE - delete", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .delete(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/products/${globalThis.product.id}`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .expect(200);

			validateProduct(response.body.data);
		});

		it("[SUBCATEGORY] DELETE - delete", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .delete(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/subcategories/${globalThis.subcategory.id}`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .expect(200);

			validateSubcategory(response.body.data);
		});

		it("[CATEGORY] DELETE - delete", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .delete(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/categories/${globalThis.category.id}`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .expect(200);
			if (response.body.data != "Category deleted") return false;
		});

		it("[MENU] DELETE - delete", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .delete(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/menus/${globalThis.menu.id}`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .expect(200);

			validateMenu(response.body.data);

			expect(response.body.data).toMatchObject({
				deletedAt: expect.any(String),
			});
		});

		it("[BRANCH] DELETE - delete", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .delete(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .expect(200);

			//console.log(response.body.data);

			validateBranch(response.body.data);

			expect(response.body.data).toMatchObject({
				deletedAt: expect.any(String),
			});

			globalThis.branch = response.body.data;
		});

		it("[BUSINESS] POST - delete", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .delete(`/v1/public/businesses/${globalThis.business.id}`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)            
            .expect(200);

			expect(response.body.data).toMatchObject({
				deletedAt: expect.any(String),
			});

			globalThis.business = response.body.data;
		});
	});
}
