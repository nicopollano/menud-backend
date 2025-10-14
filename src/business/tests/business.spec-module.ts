import { INestApplication } from "@nestjs/common";
import { validateBusiness } from "src/tests/validations/business.validate";
import request from "supertest";
import { Business } from "../entities/business.entity";

export default function runBusinessTests(getApp: () => INestApplication) {
	describe("Business Tests", () => {
		let app: INestApplication;

		beforeAll(async () => {
			app = getApp();
		});

		it("[BUSINESS] POST - create", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                .post(`/v1/public/businesses`)
                .set("Authorization", `Bearer ${globalThis.tokenOwner}`)            
                .field("name", "TESTING - CACAO")
                .field("phone", "3533440727")
                .expect(201);

			//console.log(response.body.data);
			validateBusiness(response.body.data);

			globalThis.business = response.body.data;
		});

		it("[BUSINESS] GET - findAll", async () => {
			//console.log("TOKEN", tokenOwner);

			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                .get('/v1/public/businesses')
                .set('Authorization', `Bearer ${globalThis.tokenOwner}`)
                .expect(200)

			expect(Array.isArray(response.body.data)).toBe(true);

			for (const item of response.body.data) {
				//console.log(item);
				validateBusiness(item);
			}

			const businessExists = response.body.data.find((_business: Business) => _business.id == globalThis.business.id);

			if (!businessExists) return false;
		});

		it("[BUSINESS] GET - findOne", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                .get(`/v1/public/businesses/${globalThis.business.id}`)
                .set("Authorization", `Bearer ${globalThis.tokenOwner}`)
                .expect(200);

			//console.log(response.body.data);
			validateBusiness(response.body.data);
		});

		it("[BUSINESS] POST - update", async () => {
			// biome-ignore format: easy to read
			const response = await request(app.getHttpServer())
                .patch(`/v1/public/businesses/${globalThis.business.id}`)
                .set("Authorization", `Bearer ${globalThis.tokenOwner}`)            
                .field("enabled", "false")
                .field("phone", "5555")
                .expect(200);

			expect(response.body.data).toMatchObject({
				enabled: false,
				phone: "5555",
			});

			validateBusiness(response.body.data);

			globalThis.business = response.body.data;
		});
	});
}
