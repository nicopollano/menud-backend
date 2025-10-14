import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { BranchService } from "src/branch/branch.service";
import { Menu } from "./entities/menu.entity";
import { Repository } from "typeorm";
import { CreateMenuDTO } from "./dtos/create-menu.dto";
import { NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { UploadService } from "src/upload/upload.service";
import { UpdateMenuDTO } from "./dtos/update-menu.dto";
import { PaletteService } from "src/palette/palette.service";
import { ScheduleService } from "src/schedule/schedule.service";
import { Schedule } from "src/schedule/entities/schedule.entity";
import { dateToHour } from "src/common/tools/date-to-hour.tool";
import { jsDayToEnumDay } from "src/common/tools/day-adapter.tool";
import { ProductService } from "src/product/product.service";
import { CategoryService } from "src/category/category.service";
import { SubcategoryService } from "src/subcategory/subcategory.service";
import { User } from "src/users/entities/user.entity";
import { instanceToPlain } from "class-transformer";
import { SharedPaletteService } from "src/shared-palette/shared-palette.service";
import { MenuPalette } from "src/palette/entities/menu-palette.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { MoveMenuDTO } from "./dtos/move-menu.dto";
import { CopyMenuDTO } from "./dtos/copy-menu.dto";
import { Category } from "src/category/entities/category.entity";
import { Product } from "src/product/entities/product.entity";
import { Subcategory } from "src/subcategory/entities/subcategory.entity";
import { PromotionService } from "src/promotion/promotion.service";
import { CreatePaletteDTO } from "src/palette/dtos/create-palette.dto";

@Injectable()
export class MenuService {
	constructor(
		@InjectRepository(Menu) private menuRepository: Repository<Menu>,
		@Inject(forwardRef(() => BranchService)) private branchService: BranchService,
		@Inject(forwardRef(() => UploadService)) private uploadService: UploadService,
		@Inject(forwardRef(() => PaletteService)) private palettesService: PaletteService,
		@Inject(forwardRef(() => ScheduleService)) private scheduleService: ScheduleService,
		@Inject(forwardRef(() => CategoryService)) private categoryService: CategoryService,
		@Inject(forwardRef(() => SubcategoryService)) private subcategoryService: SubcategoryService,
		@Inject(forwardRef(() => ProductService)) private productService: ProductService,
		@Inject(forwardRef(() => SharedPaletteService)) private sharedPalettesService: SharedPaletteService,
		@Inject(forwardRef(() => PromotionService)) private promotionService: PromotionService,
		private clsService: ClsService,
	) {}

	async create(cover: Express.Multer.File, logo: Express.Multer.File, createMenu: CreateMenuDTO) {
		let { name, typography, description /*, schedules*/ } = createMenu;
		const branch = this.clsService.get("branch");

		const sharedPalettes = await this.sharedPalettesService.findAll(true);

		const menuPalletes: MenuPalette[] = await this.palettesService.copyPaletteToMenu(sharedPalettes as unknown as Partial<CreatePaletteDTO[]>);

		let menu = new Menu();

		menu.name = name;
		menu.typography = typography;
		menu.menuPalettes = menuPalletes;
		menu.branch = branch;
		menu.description = description;

		/*
        const scheduleArray: Schedule[] = [];

        for(const schedule of schedules){
            const scheduleCreated: Schedule = await this.scheduleService.create(schedule);
            scheduleArray.push(scheduleCreated);
        }

        menu.schedules = scheduleArray;

        */

		menu = await this.menuRepository.save(menu);
		if (cover) menu.cover = await this.uploadService.uploadImage(cover, `Menus/${menu.id}/Cover`);
		if (logo) menu.logo = await this.uploadService.uploadImage(logo, `Menus/${menu.id}/Logo`);

		await this.menuRepository.update(menu.id, { cover: menu.cover, logo: menu.logo });

		return menu;
	}

	async update(cover: Express.Multer.File, logo: Express.Multer.File, id: number, updateMenu: UpdateMenuDTO) {
		const branch = this.clsService.get("branch");

		const menu = await this.findOne(id);

		Object.keys(updateMenu).forEach((key) => {
			menu[key] = updateMenu[key];
		});

		if (cover) menu.cover = await this.uploadService.uploadImage(cover, `Menus/${menu.id}/Cover`);
		if (logo) menu.logo = await this.uploadService.uploadImage(logo, `Menus/${menu.id}/Logo`);

		return await this.menuRepository.save(menu);
	}

	async delete(id: number) {
		const menu = await this.findOne(id);

		return await this.menuRepository.softRemove(menu);
	}

	async findOne(id: number) {
		const branch = this.clsService.get("branch");
		const menu = await this.menuRepository.findOne({
			where: {
				id,
				branch: {
					id: branch.id,
				},
			},
			relations: [
				"branch",
				"menuPalettes",
				"categories",
				/*"schedules",*/ "categories.subcategories",
				"categories.subcategories.products",
				"categories.products",
				"promotions",
			],
			order: {
				name: "ASC",
				branch: { name: "ASC" },
				menuPalettes: { id: "ASC" },
				categories: { name: "ASC", products: { name: "ASC" }, subcategories: { name: "ASC", products: { name: "ASC" } } },
			},
		});

		if (!menu) throw new NotFoundException_C(ErrorList.MenuNotFound);

		return menu;
	}

	async findAll(dayOnly: boolean = false) {
		const branch = this.clsService.get("branch");
		let day = null;
		if (dayOnly) {
			const now = new Date();
			day = jsDayToEnumDay(now.getDay());
		}

		const menus = await this.menuRepository.find({
			where: {
				branch: {
					id: branch.id,
				},
				/*schedules:{
                    day: day
                }*/
			},
			relations: ["branch", "categories", "categories.products", "categories.subcategories.products", /*"schedules",*/ "menuPalettes"],
			order: {
				name: "ASC",
				categories: { name: "ASC", subcategories: { name: "ASC", products: { name: "ASC" } }, products: { name: "ASC" } },
				menuPalettes: { id: "ASC" },
			},
		});

		if (!menus) throw new NotFoundException_C(ErrorList.MenuNotFound);

		return menus;

		const activeMenu = this.findActiveMenu(menus) ?? null;

		return {
			activeMenu,
			menus,
		};
	}

	findActiveMenu(menus: Menu[]): Menu {
		const menuActive = menus.filter((menu) => {
			const schedule = menu.schedules.find((schedule) => {
				const now = new Date();
				const nowStr = dateToHour(now);
				const start = schedule.openTime.replaceAll(":", "");
				const end = schedule.closeTime.replaceAll(":", "");
				const enumDay = jsDayToEnumDay(now.getDay());
				return schedule.days.includes(enumDay) && start <= nowStr && end >= nowStr;
			});
			return schedule;
		});

		return menuActive?.[0];
	}

	async getSummary() {
		const branch = this.clsService.get("branch");

		const menus = await this.menuRepository.find({
			where: {
				branch: {
					id: branch.id,
				},
				/*schedules:{
                    day: day
                }*/
			},
			relations: ["branch", "categories", "categories.products", "categories.subcategories.products", /*"schedules",*/ "menuPalettes"],
			order: {
				name: "ASC",
				branch: { name: "ASC" },
				categories: { name: "ASC", subcategories: { name: "ASC", products: { name: "ASC" } } },
				menuPalettes: { id: "ASC" },
			},
		});

		if (!menus) throw new NotFoundException_C(ErrorList.MenuNotFound);

		const menuWithSummary: Menu[] = instanceToPlain(menus) as Menu[];
		const totalCategories = menuWithSummary.reduce((acc, menu) => {
			return acc + menu.summary.totalCategories;
		}, 0);
		const totalProducts = menuWithSummary.reduce((acc, menu) => {
			return acc + menu.summary.totalProducts;
		}, 0);
		return {
			totalCategories,
			totalProducts,
			totalMenus: menus.length,
		};
	}

	async updateVisibility(id: number, visible: boolean) {
		const menu = await this.findOne(id);

		menu.enabled = visible;

		return await this.menuRepository.save(menu);
	}

	async permanentRemove(id: number) {
		const menu = await this.menuRepository.findOne({
			where: { id },
			withDeleted: true,
		});
		if (!menu) throw new NotFoundException_C(ErrorList.MenuNotFound);
		return this.menuRepository.remove(menu);
	}

	async copy(menuId: number, copyDTO: CopyMenuDTO, labelCopy = false) {
		const { toBranchId } = copyDTO;
		const userBranch: Branch = this.clsService.get("branch");
		const user: User = this.clsService.get("user");

		const fromMenu = await this.menuRepository.findOne({
			where: {
				id: menuId,
				branch: { id: userBranch.id },
			},
			relations: { promotions: { products: true, schedule: true }, categories: { products: true, subcategories: { products: true } }, menuPalettes: true },
		});

		if (!fromMenu) throw new NotFoundException_C(ErrorList.MenuNotFound);

		const branch = await this.branchService.findOne(toBranchId, user.id);

		async function getCopyLabel() {
			async function alreadyExists(name: string) {
				const baseName = fromMenu.name.includes(" - Copy") ? fromMenu.name.substring(0, fromMenu.name.lastIndexOf(" - Copy")) : fromMenu.name;
				const exists = await this.menuRepository.exist({
					where: {
						name: `${baseName} - ${name}`,
						branch: { id: toBranchId },
					},
				});
				return exists;
			}

			const baseName = fromMenu.name.includes(" - Copy") ? fromMenu.name.substring(0, fromMenu.name.lastIndexOf(" - Copy")) : fromMenu.name;

			if (!(await alreadyExists.call(this, "Copy"))) return `${baseName} - Copy`;
			else {
				let i = 2;
				while (await alreadyExists.call(this, `Copy (${i})`)) i++;
				return `${baseName} - Copy (${i})`;
			}
		}

		const copyLabel = await getCopyLabel.call(this);

		const newMenu = await this.menuRepository.save({
			...fromMenu,
			logo: undefined,
			cover: undefined,
			branch,
			id: undefined,
			name: labelCopy ? fromMenu.name : copyLabel,
			categories: undefined,
			promotions: undefined,
			schedules: await Promise.all(
				(fromMenu.schedules ?? []).map(async (schedule) => {
					return await this.scheduleService.createDirect({
						...schedule,
						id: undefined,
					});
				}),
			),
			menuPalettes: undefined,
		});

		newMenu.categories = await Promise.all(
			fromMenu.categories?.map(async (cat) => {
				const newCategory = await this.categoryService.createDirect({
					...cat,
					id: undefined,
					image: "",
					products: await Promise.all(
						cat.products?.map(async (prod) => {
							const newProduct = await this.productService.createDirect({
								...prod,
								/* branch, */
								id: undefined,
								categories: undefined,
								subcategories: undefined,
								images: undefined,
							});

							newProduct.images = await Promise.all(
								(prod.images ?? []).map(async (img) => {
									return await this.uploadService.copyImage(img, `Menus/Products/${newProduct.id}`, false, branch.business, branch);
								}),
							);

							await this.productService.updateProduct(newProduct.id, {
								images: newProduct.images,
							});

							return newProduct;
						}),
					),
					subcategories: await Promise.all(
						cat.subcategories?.map(async (sub) => {
							const subSaved = await this.subcategoryService.createDirect({
								...sub,
								id: undefined,
								image: "",
								products: await Promise.all(
									sub.products?.map(async (prod) => {
										const newProduct = await this.productService.createDirect({
											...prod,
											/* branch, */
											id: undefined,
											categories: undefined,
											subcategories: undefined,
											images: undefined,
										});

										newProduct.images = await Promise.all(
											(prod.images ?? []).map(async (img) => {
												return await this.uploadService.copyImage(img, `Menus/Products/${newProduct.id}`, false, branch.business, branch);
											}),
										);

										await this.productService.updateProduct(newProduct.id, {
											images: newProduct.images,
										});

										return newProduct;
									}),
								),
							});
							subSaved.image = await this.uploadService.copyImage(sub.image, `Menus/${newMenu.id}/Subcategories/${sub.id}/`, false, branch.business, branch);
							await this.subcategoryService.save(subSaved);
							return subSaved;
						}),
					),
				});
				newCategory.image = await this.uploadService.copyImage(cat.image, `Menus/${newMenu.id}/Categories/${newCategory.id}/`, false, branch.business, branch);
				await this.categoryService.save(newCategory);
				return newCategory;
			}),
		);

		(newMenu.promotions = await Promise.all(
			(fromMenu.promotions ?? []).map(async (promo) => {
				const copiedProducts: Product[] = [];
				if (promo.products && promo.products.length > 0) {
					for (const originalProduct of promo.products) {
						for (const category of newMenu.categories) {
							const foundProduct = category.products?.find((prod) => prod.name === originalProduct.name);
							if (foundProduct) {
								copiedProducts.push(foundProduct);
								continue;
							}

							for (const subcategory of category.subcategories ?? []) {
								const foundSubProduct = subcategory.products?.find((prod) => prod.name === originalProduct.name);
								if (foundSubProduct) {
									copiedProducts.push(foundSubProduct);
									break;
								}
							}
						}
					}
				}
				const promotion = await this.promotionService.createDirect({
					...promo,
					id: undefined,
					menu: undefined,
					image: undefined,
					schedule: await this.scheduleService.createDirect({
						...promo.schedule,
						branch,
						menu: undefined,
						id: undefined,
					}),
					products: copiedProducts,
				});

				const promotionImageUrl = await this.uploadService.copyImage(
					promo.image,
					`Menus/${newMenu.id}/Promotions/${promotion.id}`,
					false,
					branch.business,
					branch,
				);
				const promotionUpdated = await this.promotionService.updatePromotion(promotion.id, { image: promotionImageUrl });
				promotion.image = promotionImageUrl;
				return promotion;
			}),
		)),
			(newMenu.logo = await this.uploadService.copyImage(fromMenu.logo, `Menus/${newMenu.id}/Logo`, false, branch.business, branch)),
			(newMenu.cover = await this.uploadService.copyImage(fromMenu.cover, `Menus/${newMenu.id}/Cover`, false, branch.business, branch)),
			await this.menuRepository.save({
				id: newMenu.id,
				logo: newMenu.logo,
				cover: newMenu.cover,
				categories: newMenu.categories,
				promotions: newMenu.promotions,
			});

		await Promise.all(
			fromMenu.menuPalettes.map(async ({ menu, id, ...palette }) => {
				return await this.palettesService.createDirect({
					...palette,
					id: undefined,
					menu: newMenu,
				});
			}),
		);

		return newMenu;
	}

	async move(menuId: number, moveDTO: MoveMenuDTO) {
		const { toBranchId } = moveDTO;
		const userBranch: Branch = this.clsService.get("branch");
		const user: User = this.clsService.get("user");

		const menu = await this.menuRepository.findOne({
			where: {
				id: menuId,
				branch: { id: userBranch.id },
			},
			relations: { categories: { products: true, subcategories: { products: true } } },
		});

		if (!menu) throw new NotFoundException_C(ErrorList.MenuNotFound);

		const branch = await this.branchService.findOne(toBranchId, user.id);

		menu.branch = branch;

		await this.uploadService.moveFolder(
			`/${process.env.STAGE}/buk${userBranch.business.id}/branches/${userBranch.id}/Menus/${menu.id}`,
			`/${process.env.STAGE}/buk${branch.business.id}/branches/${branch.id}/Menus/${menu.id}`,
		);

		return await this.menuRepository.save(menu);
	}
}
