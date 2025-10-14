import * as dotenv from "dotenv";
dotenv.config();
//import "./tracing";
import { Logger } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ApiParam, DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { PublicGuard } from "./common/guards/public.guard";
import { JwtService } from "@nestjs/jwt";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { ErrorsInterceptor } from "./common/interceptors/errors.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { UserInterceptor } from "./common/interceptors/user.interceptor";
import { ClsService } from "nestjs-cls";
import { RolesGuard } from "./common/guards/roles.guard";
import { UsersService } from "./users/users.service";
import {} from "@nestjs/platform-socket.io";
import { WsJwtGuard } from "./common/guards/wss.guard";
import { WebSocketInterceptor } from "./common/interceptors/ws.interceptor";
import { WsExceptionsFilter } from "./common/filters/ws-exception.filter";
import "reflect-metadata";
import { applyDecorators, VersioningType } from "@nestjs/common";
import { describe } from "node:test";
import { BusinessGuard } from "./common/guards/business.guard";
import { BranchGuard } from "./common/guards/branch.guard";
import { dateToHour } from "./common/tools/date-to-hour.tool";
import { BusinessService } from "./business/business.service";
import { config as configg } from "./config";
import { PermissionGuard } from "./common/guards/permission.guard";
import { MenuGuard } from "./common/guards/menu.guard";
import { SubscriptionGuard } from "./common/guards/subscription.guard";
import { SubscriptionService } from "./subscription/substription.service";
import { BranchService } from "./branch/branch.service";

async function bootstrap() {
	const bootstrapLogger = new Logger("Bootstrap");
	const app = await NestFactory.create(AppModule, {
		logger: bootstrapLogger,
	});
	configg;
	app.enableVersioning({
		type: VersioningType.URI,
	});

	const config = new DocumentBuilder()
		.setTitle(`RistoKit API`)
		.setDescription(
			'The ristokit API description<br><hr></hr><h3>Websocket documentation</h3><br><a href="https://github.com/iterawebprojects/gastronomic-backend/blob/main/documentation/websocket.md"><strong>Documentacion</strong></a><br><a href="https://ristokitdocumentation.postman.co/workspace/RistoKitDocumentation~df154953-cf1f-43f5-8fc9-639daa8e5f6e/overview"><strong>Postman</strong></a>\n\n---\n\n### EXPORT Postman\n```url\nhttps://ristokit-backend-' +
				process.env.STAGE.toLowerCase() +
				".pidrive.com.ar/swagger-json\n```\n\n\n\n---\n\n## Index\n\n- [Authentications](#/Authentications)\n- [Users](#/Users)\n- [Subscriptions](#/Subscriptions)\n- [Branches](#/Branches)\n- [Businesses](#/Businesses)\n- [Uploads](#/Uploads)\n- [Products](#/Products)\n- [Categories](#/Categories)\n- [Subcategories](#/Subcategories)\n- [Menus](#/Menus)\n- [Palettes](#/Palettes)\n- [Members](#/Members)\n- [Schedule](#/Schedule)\n- [Promotions](#/Promotions)",
		)
		.setVersion("2.1")
		.addBearerAuth(
			{
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
				description: `Introduce el token en formato: Bearer {token}`,
			},
			"Authorization",
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);

	app.getHttpAdapter().get("/swagger-json", (_, res) => {
		(document as any).servers = [
			{
				url: `https://ristokit-backend-develop.pidrive.com.ar`,
				description: "Default server",
				variables: {
					bearerToken: { default: "1" },
					businessid: { default: "1" },
					branchid: { default: "" },
				},
			},
		];
		res.json(document);
	});
	SwaggerModule.setup("api-docs", app, document, {
		customJsStr:
			"function scrollToSwaggerSection(event) {const targetId = event.target.getAttribute('href').substring(2); console.log(targetId); const element = document.getElementById('operations-tag-'+targetId);element.scrollIntoView({ behavior: 'smooth' });}" +
			"window.addEventListener(\"load\", ()=>{ setTimeout(()=>{document.querySelectorAll('a[target=\"_blank\"').forEach((href)=> { href.removeAttribute('target'); href.addEventListener('click', scrollToSwaggerSection); });}, 1000)  });",
	});
	app.enableCors({
		origin: "*",
		credentials: true,
	});

	const reflector = app.get(Reflector);
	const jwtService = app.get(JwtService);
	const clsService = app.get(ClsService);
	const userService = app.get(UsersService);
	const businessService = app.get(BusinessService);
	const branchService = app.get(BranchService);
	const subscriptionService = app.get(SubscriptionService);

	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalInterceptors(new ResponseInterceptor(), new ErrorsInterceptor(), new UserInterceptor(clsService, userService));

	app.useGlobalGuards(
		new PublicGuard(reflector, clsService, jwtService, userService),
		new RolesGuard(reflector, userService, clsService),
		new BusinessGuard(reflector, clsService, businessService),
		new BranchGuard(reflector, clsService),
		new MenuGuard(reflector),
		new PermissionGuard(reflector, userService, clsService, businessService),
		new SubscriptionGuard(subscriptionService, businessService, branchService, reflector, clsService),
	);

	await app.listen(process.env.PORT || 3000);

	const { Logger: PinoLogger } = await import("nestjs-pino");
	const pinoLogger = app.get(PinoLogger);
	app.useLogger(pinoLogger);
}

bootstrap();
