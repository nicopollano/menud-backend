require("dotenv").config();
import { Branch } from "src/branch/entities/branch.entity";
import { Category } from "src/category/entities/category.entity";
import { MenuPalette } from "src/palette/entities/menu-palette.entity";

(globalThis as any).Branch = Branch;
(globalThis as any).Category = Category;
(globalThis as any).MenuPalette = MenuPalette;

import { INestApplication, VersioningType } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ClsService } from "nestjs-cls";
import { UsersService } from "src/users/users.service";
import { BusinessService } from "src/business/business.service";
import { HttpExceptionFilter } from "src/common/filters/http-exception.filter";
import { ResponseInterceptor } from "src/common/interceptors/response.interceptor";
import { ErrorsInterceptor } from "src/common/interceptors/errors.interceptor";
import { UserInterceptor } from "src/common/interceptors/user.interceptor";
import { PublicGuard } from "src/common/guards/public.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { BusinessGuard } from "src/common/guards/business.guard";
import { BranchGuard } from "src/common/guards/branch.guard";
import { Business } from "src/business/entities/business.entity";
import { Menu } from "src/menu/entities/menu.entity";
import { Product } from "src/product/entities/product.entity";
import { Subcategory } from "src/subcategory/entities/subcategory.entity";
import { User } from "src/users/entities/user.entity";

export async function initApp(app: INestApplication) {
	app.enableVersioning({ type: VersioningType.URI });
	app.enableCors({ origin: "*", credentials: true });

	const reflector = app.get(Reflector);
	const jwtService = app.get(JwtService);
	const clsService = app.get(ClsService);
	const userService = app.get(UsersService);
	const businessService = app.get(BusinessService);

	(globalThis as any).app = {} as INestApplication;
	(globalThis as any).userOwner = {} as User;
	(globalThis as any).userManager = {} as User;
	(globalThis as any).tokenOwner = "";
	(globalThis as any).tokenManager = "";
	(globalThis as any).business = {} as Business;
	(globalThis as any).branch = {} as Branch;
	(globalThis as any).menu = {} as Menu;
	(globalThis as any).category = {} as Category;
	(globalThis as any).subcategory = {} as Subcategory;
	(globalThis as any).product = {} as Product;

	//app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalInterceptors(new ResponseInterceptor(), new ErrorsInterceptor(), new UserInterceptor(clsService, userService));
	app.useGlobalGuards(
		new PublicGuard(reflector, clsService, jwtService, userService),
		new RolesGuard(reflector, userService, clsService),
		new BusinessGuard(reflector, clsService, businessService),
		new BranchGuard(reflector, clsService),
	);
}
