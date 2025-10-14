import { INestApplication } from "@nestjs/common";
import { before } from "node:test";
import request from "supertest";

export default function runAuthTests(getApp: () => INestApplication) {
	describe("Auth Tests", () => {
		let app: INestApplication;

		beforeAll(async () => {
			app = getApp();
		});

		it("[AUTH] POST - SINGUP OWNER", async () => {
			const response = await request(app.getHttpServer())
				.post("/v1/public/auth/sign-up")
				.send({
					email: "testingowner@test.script",
					name: "Owner",
					surname: "Test",
					phone: "123456789",
					password: "password",
				})
				.expect(201);

			expect(response.body.data).toEqual({
				id: expect.any(Number),
				name: "Owner",
				surname: "Test",
				email: "testingowner@test.script",
			});
			globalThis.userOwner = response.body.data;
			globalThis.tokenOwner = response.body.data.accessToken;
		});

		it("[AUTH] POST - SINGUP MANAGER", async () => {
			const response = await request(app.getHttpServer())
				.post("/v1/public/auth/sign-up")
				.send({
					email: "testingmanager@test.script",
					name: "Manager",
					surname: "Test",
					phone: "987654321",
					password: "password",
				})
				.expect(201);
			expect(response.body.data).toEqual({
				id: expect.any(Number),
				name: "Manager",
				surname: "Test",
				email: "testingmanager@test.script",
			});
			globalThis.userManager = response.body.data;
			globalThis.tokenManager = response.body.data.accessToken;
		});

		it("[AUTH] POST - Login Owner", async () => {
			const response = await request(app.getHttpServer())
				.post("/v1/public/auth/sign-in")
				.send({
					email: "testingowner@test.script",
					password: "password",
				})
				.expect(201);
			expect(response.body.data).toHaveProperty("accessToken");
			globalThis.tokenOwner = response.body.data.accessToken;
		});

		it("[AUTH] POST - Login Manager", async () => {
			const response = await request(app.getHttpServer())
				.post("/v1/public/auth/sign-in")
				.send({
					email: "testingowner@test.script",
					password: "password",
				})
				.expect(201);
			expect(response.body.data).toHaveProperty("accessToken");
			globalThis.tokenManager = response.body.data.accessToken;
		});
	});
}
