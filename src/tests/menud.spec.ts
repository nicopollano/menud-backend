import { INestApplication, VersioningType } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { AppModule } from "src/app.module";
import { BusinessService } from "src/business/business.service";
import { HttpExceptionFilter } from "src/common/filters/http-exception.filter";
import { BranchGuard } from "src/common/guards/branch.guard";
import { BusinessGuard } from "src/common/guards/business.guard";
import { PublicGuard } from "src/common/guards/public.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { ErrorsInterceptor } from "src/common/interceptors/errors.interceptor";
import { ResponseInterceptor } from "src/common/interceptors/response.interceptor";
import { UserInterceptor } from "src/common/interceptors/user.interceptor";
import { UsersService } from "src/users/users.service";
import request from "supertest";
import { validateBusiness } from "./validations/business.validate";
import { Business } from "src/business/entities/business.entity";
import { validateBranch } from "./validations/branch.validation";
import { Branch } from "src/branch/entities/branch.entity";
import { Menu } from "src/menu/entities/menu.entity";
import { validateMenu } from "./validations/menu.validate";
import { Category } from "src/category/entities/category.entity";
import { validateCategory } from "./validations/category.validate";
import { Subcategory } from "src/subcategory/entities/subcategory.entity";
import { validateSubcategory } from "./validations/subcategory.validation";
import { Product } from "src/product/entities/product.entity";
import { validateProduct } from "./validations/product.validate";
import { initApp } from "./setup";
import runAuthTests from "src/auth/tests/auth.spec-module";
import { before } from "node:test";
import runBusinessTests from "src/business/tests/business.spec-module";
import runBranchTests from "src/branch/tests/branch.spec-module";
import runMenuTests from "src/menu/tests/menu.spec-module";
import runCategoryTests from "src/category/tests/category.spec-module";
import runSubcategoryTests from "src/subcategory/tests/subcategory.spec-module";
import runDeleteTests from "./delete.spec-module";
import runProductTests from "src/product/tests/product.spec-module";
import runCleanupTests from "./cleanup.spec-module";

describe("MENUD TESTS", () => {
	let app: INestApplication;
	let tokenOwner: string;
	let tokenManager: string;
	let business: Business;
	let branch: Branch;
	let menu: Menu;
	let category: Category;
	let subcategory: Subcategory;
	let product: Product;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();

		await await initApp(app);

		await app.init();

		global.__APP__ = app;
	});

	afterAll(async () => {
		await app.close();
	});

	runAuthTests(() => app);
	runBusinessTests(() => app);
	runBranchTests(() => app);
	runMenuTests(() => app);
	runCategoryTests(() => app);
	runSubcategoryTests(() => app);
	runProductTests(() => app);
	runDeleteTests(() => app);
	runCleanupTests(() => app);
});
