import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Promotion } from "./entities/promotion.entity";
import { Between, Repository } from "typeorm";
import { CreatePromotionDTO } from "./dtos/create-promotion.dto";
import { Branch } from "src/branch/entities/branch.entity";
import { ClsService } from "nestjs-cls";
import { BadRequestException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { UpdatePromotionDTO, UpdatePromotionWithImageDTO } from "./dtos/update-promotion.dto";
import { isNotEmpty } from "class-validator";
import { ProductService } from "src/product/product.service";
import { enumDayToDayName } from "src/common/tools/day-adapter.tool";
import { ValidateDayPromotionDTO } from "./dtos/validate-day.dto";
import { ScheduleService } from "src/schedule/schedule.service";
import { MenuService } from "src/menu/menu.service";
import { UploadService } from "src/upload/upload.service";
import { Schedule } from "src/schedule/entities/schedule.entity";

@Injectable()
export class PromotionService {
	constructor(
		@InjectRepository(Promotion) private promotionRepository: Repository<Promotion>,
		@Inject(forwardRef(() => ProductService)) private productService: ProductService,
		@Inject(forwardRef(() => ScheduleService)) private scheduleService: ScheduleService,
		@Inject(forwardRef(() => MenuService)) private menuService: MenuService,
		@Inject(forwardRef(() => UploadService)) private uploadService: UploadService,
		private clsService: ClsService,
	) {}

	async create(image: Express.Multer.File, createPromotionDTO: CreatePromotionDTO) {
		const { description, productIds, title, fromTime, toTime, days, menuId } = createPromotionDTO;
		const daysAvailable = await this.validateDay({ fromTime, toTime, menuId });
		const menu = await this.menuService.findOne(menuId);
		const isAnyDayBusy = !days.every((day) => daysAvailable.includes(day));
		if (isAnyDayBusy) throw new BadRequestException_C(ErrorList.PromotionDayBusy);
		const products = productIds ? await Promise.all(productIds.map(async (productId) => await this.productService.findOne(productId))) : [];

		const schedules = await this.scheduleService.create([
			{
				enabled: true,
				openTime: fromTime,
				closeTime: toTime,
				days,
			},
		]);

		const promotion = await this.promotionRepository.save({
			menu,
			description,
			title,
			products,
			schedule: schedules[0],
		});

		if (!promotion) throw new BadRequestException_C(ErrorList.PromotionBadRequest);

		promotion.image = !image ? null : await this.uploadService.uploadImage(image, `Menus/${menuId}/Promotions/${promotion.id}`);

		return await this.promotionRepository.save(promotion);
	}

	async update(id: number, image: Express.Multer.File, updatePromotionDTO: UpdatePromotionDTO) {
		const { productIds, description, days, ...updatePromotionRest } = updatePromotionDTO;

		const promotion = await this.findOne(id);

		const daysAvailable = await this.validateDay({ fromTime: promotion.schedule.openTime, toTime: promotion.schedule.closeTime, menuId: promotion.menu.id });

		if (days?.length <= 0) {
			const newDays = days;

			const daysAvailableExcludingCurrent = [...daysAvailable, ...promotion.schedule.days.filter((day) => !daysAvailable.includes(day))];

			const isAnyDayBusy = !newDays.every((day) => daysAvailableExcludingCurrent.includes(day));

			if (isAnyDayBusy) throw new BadRequestException_C(ErrorList.PromotionDayBusy);
		}
		if (productIds) {
			const products = await Promise.all(productIds.map(async (productId) => await this.productService.findOne(productId)));
			promotion.products = products;
		}

		promotion.image = !image ? null : await this.uploadService.uploadImage(image, `Menus/${updatePromotionRest.menuId}/Promotions/${promotion.id}`);
		promotion.description = description;
		promotion.schedule.days = days;
		await this.scheduleService.save(promotion.schedule);
		Object.keys(updatePromotionRest).forEach((key) => {
			if (isNotEmpty(updatePromotionRest[key])) promotion[key] = updatePromotionRest[key];
		});

		return await this.promotionRepository.save(promotion);
	}

	async updatePromotion(id: number, updatePromotionDTO: Partial<UpdatePromotionWithImageDTO>) {
		return this.promotionRepository.update(id, updatePromotionDTO);
	}

	async findOne(promotionId: number) {
		const branch: Branch = this.clsService.get("branch");

		const promotion = await this.promotionRepository.findOne({
			where: {
				menu: {
					branch: { id: branch.id },
				},
				id: promotionId,
			},
			relations: ["products", "schedule", "menu"],
			order: {
				title: "ASC",
				products: { name: "ASC" },
			},
		});

		if (!promotion) throw new NotFoundException_C(ErrorList.PromotionNotFound);

		return promotion;
	}

	async findAll(menuId: number = undefined) {
		const branch: Branch = this.clsService.get("branch");

		const promotions = await this.promotionRepository.find({
			where: {
				menu: {
					id: menuId,
					branch: { id: branch.id },
				},
			},
			relations: ["products", "menu", "schedule"],
			order: {
				id: "ASC",
				products: { name: "ASC" },
			},
		});

		promotions.sort((a, b) => {
			const openA = a.schedule?.openTime ?? "";
			const openB = b.schedule?.openTime ?? "";
			return openA.localeCompare(openB);
		});

		if (!promotions) throw new NotFoundException_C(ErrorList.PromotionNotFound);

		return promotions;
	}

	async delete(promotionId) {
		const promotion = await this.findOne(promotionId);
		return this.promotionRepository.softRemove(promotion);
	}

	async summary(menuId: number = undefined) {
		const branch: Branch = this.clsService.get("branch");

		const total = await this.promotionRepository.count({
			where: {
				menu: {
					id: menuId,
					branch: {
						id: branch.id,
					},
				},
			},
		});

		return {
			totalPromotions: total,
		};
	}

	async validateDay(validateDayPromotionDTO: ValidateDayPromotionDTO) {
		const branch: Branch = this.clsService.get("branch");
		const { fromTime, toTime, menuId } = validateDayPromotionDTO;

		const overlappingPromotions = await this.promotionRepository.find({
			where: {
				menu: {
					id: menuId,
					branch: { id: branch.id },
				},
				enabled: true,
			},
			relations: ["schedule", "menu"],
		});

		const availableDays: number[] = [];

		for (let dayNum = 1; dayNum <= 7; dayNum++) {
			const isAvailable = !overlappingPromotions.some((promotion) => {
				const schedule = promotion.schedule;
				if (!schedule.days.includes(dayNum)) return false;

				const scheduleFrom = new Date(schedule.openTime.replace(" ", "T"));
				const scheduleTo = new Date(schedule.closeTime.replace(" ", "T"));
				const queryFrom = new Date(fromTime.replace(" ", "T"));
				const queryTo = new Date(toTime.replace(" ", "T"));

				if (scheduleFrom.getFullYear() !== queryFrom.getFullYear() || scheduleFrom.getMonth() !== queryFrom.getMonth()) return false;

				const scheduleFromTime = scheduleFrom.getHours() * 60 + scheduleFrom.getMinutes();
				const scheduleToTime = scheduleTo.getHours() * 60 + scheduleTo.getMinutes();
				const queryFromTime = queryFrom.getHours() * 60 + queryFrom.getMinutes();
				const queryToTime = queryTo.getHours() * 60 + queryTo.getMinutes();

				const overlaps = scheduleFromTime < queryToTime && scheduleToTime > queryFromTime;

				return overlaps;
			});

			if (isAvailable) {
				availableDays.push(dayNum);
			}
		}

		return availableDays;
	}

	async createDirect(promotion: Promotion) {
		return await this.promotionRepository.save(promotion);
	}
}
