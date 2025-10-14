import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { OrdersModule } from "./orders/orders.module";
import { OrderProductModule } from "./order-product/order-product.module";
import { ProductModule } from "./product/product.module";
import { TablesModule } from "./tables/tables.module";
import { CategoryModule } from "./category/category.module";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { UploadModule } from "./upload/upload.module";
import { SummaryModule } from "./summary/summary.module";
import { SubscriptionModule } from "./subscription/subscription.module";
import { ClsModule, ClsService } from "nestjs-cls";
import { UserInterceptor } from "./common/interceptors/user.interceptor";
import { BranchModule } from "./branch/branch.module";
//import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from "./email/email.module";
import { BusinessModule } from "./business/business.module";
import { WebSocketServerModule } from "./websocket/websocket.module";
import { InitOrderCounterService } from "./common/services/initOrderCounters.service";
import { Order } from "./orders/entities/order.entity";
import { SubcategoryModule } from "./subcategory/subcategory.module";
import { MenuModule } from "./menu/menu.module";
import { PrefixMiddleware } from "./common/middleware/prefix.middleware";
import { PaletteModule } from "./palette/palette.module";
import { MemberModule } from "./member/member.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { BusinessGuard } from "./common/guards/business.guard";
import { BranchGuard } from "./common/guards/branch.guard";
import { PromotionModule } from "./promotion/promotion.module";
import { PermissionModule } from "./permission/permission.module";
import { ProfileModule } from "./profile/profile.module";
import { LinkitModule } from "./linkit/linkit.module";
import { BootstrapModule } from "./bootstrap/bootstrap.module";
import { PlanModule } from "./plan/plan.module";
import { LoggerModule } from "nestjs-pino";
import chalk from "chalk";
import { max } from "class-validator";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
		}),
		LoggerModule.forRoot({
			pinoHttp: {
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "SYS:standard",
						singleLine: false,
					},
				},
				customLogLevel: (req, res, err) => {
					if (res.statusCode >= 500) return "fatal";
					if (res.statusCode >= 400) return "error";
					return "info";
				},
				messageKey: "msg",

				serializers: {
					req: (req) => ({
						method: req.method,
						url: req.url,
						token: req.headers["authorization"],
					}),
					res: (res) => res.statusCode,
				},
			},
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				host: configService.get<string>("HOST"),
				port: configService.get<number>("PORT_DB"),
				username: configService.get<string>("USERNAME_DB"),
				password: configService.get<string>("PASSWORD"),
				database: configService.get<string>("HOSTNAME_ENV") ?? configService.get<string>("DATABASE"),
				entities: [__dirname + "/**/*.entity{.ts,.js}"],
				synchronize: true,
				schema: "public",
				//logging: ["query", "error"],
				extra: {
					max: 10,
					connectionTimeoutMillis: 5000,
					idleTimeoutMillis: 120000,
				},
				ssl:
					configService.get<string>("DB_SSL") == "true"
						? {
								rejectUnauthorized: false,
							}
						: false,
				subscribers: ["dist/**/subscribers/*.subscriber.js"],
			}),
			inject: [ConfigService],
		}),
		ClsModule.forRoot({
			global: true,
			middleware: { mount: true },
		}),
		/*
    MailerModule.forRoot({
      transport:{
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth:{
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      }
    }),
    */
		TypeOrmModule.forFeature([Order]),
		AuthModule,
		UsersModule,
		ProductModule,
		CategoryModule,
		UploadModule,
		SubscriptionModule,
		BranchModule,
		BusinessModule,
		SubcategoryModule,
		MenuModule,
		PaletteModule,
		MemberModule,
		ScheduleModule,
		PromotionModule,
		PermissionModule,
		ProfileModule,
		LinkitModule,
		BootstrapModule,
		PlanModule,
	],
	providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }, InitOrderCounterService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(PrefixMiddleware).forRoutes("/");
	}
}
