import { INestApplication } from "@nestjs/common";
import { before } from "node:test";
import { validateMenu } from "src/tests/validations/menu.validate";
import request from "supertest";

export default function runMenuTests(getApp: () => INestApplication) {
	describe("Menu Tests", () => {
		let app: INestApplication;

		beforeAll(async () => {
			app = getApp();
		});

		it("[MENU] POST - create", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                    .post(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/menus`)
                    .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                    .field("name", "menu-testing")
                    .expect(201);

			validateMenu(response.body.data);

			globalThis.menu = response.body.data;
		});

		it("[MENU] PATCH - update", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                    .patch(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/menus/${globalThis.menu.id}`)
                    .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                    .field("description", "como coco")
                    .expect(200);

			validateMenu(response.body.data);

			expect(response.body.data).toMatchObject({
				description: "como coco",
			});

			globalThis.menu = response.body.data;
		});

		it("[MENU] GET - findAll", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                    .get(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/menus`)
                    .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                    .expect(200);

			for (const items of response.body.data) validateMenu(items);

			const menuExists = response.body.data.find((_menu) => _menu.id == globalThis.menu.id);

			if (!menuExists) return false;
		});

		it("[MENU] PUT - visibility", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                    .put(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/menus/${globalThis.menu.id}/visibility`)
                    .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                    .send({
                        visibility: !globalThis.menu.enabled
                    })
                    .expect(200);

			expect(response.body.data).toMatchObject({
				enabled: !globalThis.menu.enabled,
			});

			globalThis.menu = response.body.data;
		});

		it("[MENU] GET - findOne", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                    .get(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}/menus/${globalThis.menu.id}`)
                    .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                    .expect(200);

			validateMenu(response.body.data);
		});
	});
}
