import { INestApplication } from "@nestjs/common";
import { BranchService } from "src/branch/branch.service";
import { BusinessService } from "src/business/business.service";
import { CategoryService } from "src/category/category.service";
import { MenuService } from "src/menu/menu.service";
import { ProductService } from "src/product/product.service";
import { SubcategoryService } from "src/subcategory/subcategory.service";
import { UsersService } from "src/users/users.service";

export default function runCleanupTests(getApp: () => INestApplication) {
	describe("CLEANUP DATABASE TESTS", () => {
		let app: INestApplication;
		beforeAll(async () => {
			app = getApp();
		});

		it("[USERS] DELETE - delete", async () => {
			// biome-ignore format: easy to read
			const userService: UsersService = app.get(UsersService);

			await userService.permanentRemove(globalThis.userOwner.id);
			await userService.permanentRemove(globalThis.userManager.id);
		});

		it("[CLEANUP] PRODUCT", async () => {
			const product = app.get(ProductService);

			await product.permanentRemove(globalThis.product.id);
		});

		it("[CLEANUP] SUBCATEGORY", async () => {
			const subcategory = app.get(SubcategoryService);

			await subcategory.permanentRemove(globalThis.subcategory.id);
		});

		it("[CLEANUP] CATEGORY", async () => {
			const category = app.get(CategoryService);

			await category.permanentRemove(globalThis.category.id);
		});

		it("[CLEANUP] CATEGORY", async () => {
			const menu = app.get(MenuService);

			await menu.permanentRemove(globalThis.menu.id);
		});

		it("[CLEANUP] BRANCH", async () => {
			const branch = app.get(BranchService);

			await branch.permanentRemove(globalThis.branch.id);
		});

		it("[CLEANUP] BUSINESS", async () => {
			const business = app.get(BusinessService);

			await business.permanentRemove(globalThis.business.id);
		});
	});
}
