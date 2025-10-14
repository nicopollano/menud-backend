import { INestApplication } from "@nestjs/common";
import { before } from "node:test";
import { validateBranch } from "src/tests/validations/branch.validation";
import request from "supertest";
import { Branch } from "../entities/branch.entity";

export default function runBranchTests(getApp: () => INestApplication) {
	describe("Branch Tests", () => {
		let app: INestApplication;

		beforeAll(async () => {
			app = getApp();
		});

		it("[BRANCH] POST - create", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .post(`/v1/public/businesses/${globalThis.business.id}/branches`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .field("name", "testing-branch")
            .field("phone", "1111")
            .expect(201);

			//console.log(response.body.data);

			validateBranch(response.body.data);

			globalThis.branch = response.body.data;
		});

		it("[BRANCH] PATCH - update", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .patch(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .field("phone", "2222")
            .field("enabled", !globalThis.branch.enabled)
            .expect(200);

			//console.log(response.body.data);

			validateBranch(response.body.data);

			expect(response.body.data).toMatchObject({
				enabled: !globalThis.branch.enabled,
				phone: "2222",
			});

			globalThis.branch = response.body.data;
		});

		it("[BRANCH] GET - findAll", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .get(`/v1/public/businesses/${globalThis.business.id}/branches`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .expect(200);

			for (const item of response.body.data) validateBranch(item);

			const branchExists = response.body.data.find((_branch: Branch) => (_branch.id = globalThis.branch.id));

			if (!branchExists) return false;
		});

		it("[BRANCH] GET - findOne", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
            .get(`/v1/public/businesses/${globalThis.business.id}/branches/${globalThis.branch.id}`)
            .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
            .expect(200);

			validateBranch(response.body.data);
		});
	});
}
