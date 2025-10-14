import { InjectRepository } from "@nestjs/typeorm";
import { Subcategory } from "./entities/subcategory.entity";
import { Repository } from "typeorm";
import { BadRequestException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { ClsService } from "nestjs-cls";
import { forwardRef, Inject } from "@nestjs/common";
import { CategoryService } from "src/category/category.service";
import { UploadService } from "src/upload/upload.service";
import { UpdateSubcategoryDto } from "./dtos/update-subcategory.dto";
import { ProductService } from "src/product/product.service";
import { CreateSubcategoryDTO } from "./dtos/create-subcategory.dto";
import { FilterSubcategoryDTO } from "./dtos/filter-subcategory.dto";
import { Menu } from "src/menu/entities/menu.entity";
import { Category } from "src/category/entities/category.entity";
import { MenuService } from "src/menu/menu.service";
import { isNotEmpty } from "class-validator";
import { get } from "http";

export class SubcategoryService {
	constructor(
		@InjectRepository(Subcategory) private subcategoryRepository: Repository<Subcategory>,
		@Inject(forwardRef(() => CategoryService)) private categoryService: CategoryService,
		@Inject(forwardRef(() => UploadService)) private uploadService: UploadService,
		@Inject(forwardRef(() => ProductService)) private productService: ProductService,
		@Inject(forwardRef(() => MenuService)) private menuService: MenuService,
		private clsService: ClsService,
	) {}

	async findOne(id: number, categoryId: number = undefined) {
		const subcategory = await this.subcategoryRepository.findOne({
			where: {
				id,
				category: {
					id: categoryId,
				},
			},
			relations: ["products", "category"],
			order: {
				name: "ASC",
				products: { name: "ASC" },
			},
		});
		if (!subcategory) throw new NotFoundException_C(ErrorList.SubcategoryNotFound);

		return subcategory;
	}

	async getMenu(subcategoryId: number) {
		const subcategory = await this.subcategoryRepository.findOne({
			where: { id: subcategoryId },
			relations: ["category", "category.menu"],
		});
		if (!subcategory) throw new NotFoundException_C(ErrorList.SubcategoryNotFound);
		return subcategory.category.menu;
	}

	async findAll(categoryid: number) {
		const category = await this.categoryService.findOne(categoryid);

		const subcategories = await this.subcategoryRepository.find({
			where: {
				category: {
					id: category.id,
				},
			},
			relations: ["products"],
			order: {
				name: "ASC",
				products: { name: "ASC" },
			},
		});

		if (!subcategories) throw new NotFoundException_C(ErrorList.SubcategoryNotFound);

		return subcategories;
	}

	async create(file: Express.Multer.File, createSubcategoryDto: CreateSubcategoryDTO) {
		const { name, categoryId, description } = createSubcategoryDto;

		const category = await this.categoryService.findOne(categoryId);

		// if(categoryFind) throw new BadRequestException_C(ErrorList.CategoryAlreadyExist);

		const subcategory = await this.subcategoryRepository.create();

		subcategory.name = name;
		subcategory.description = description;

		subcategory.category = category;

		try {
			const subcategorySaved = await this.subcategoryRepository.save(subcategory);
			if (file) {
				subcategory.image = await this.uploadService.uploadImage(file, `Menus/${category.menu.id}/Subcategories/${subcategorySaved.id}/`);
				await this.subcategoryRepository.update(subcategorySaved.id, { image: subcategory.image });
			}
			return subcategorySaved;
		} catch (error) {
			console.log(error);
			throw new BadRequestException_C(ErrorList.InternalError);
		}
	}

	async createDirect(params: Partial<Subcategory>) {
		return await this.subcategoryRepository.save(params);
	}

	async delete(id: number) {
		if (!id) throw new BadRequestException_C(ErrorList.SubcategoryNotFound);
		const subcategory = await this.findOne(id);
		return await this.subcategoryRepository.softRemove(subcategory);
	}

	async update(id: number, updateCategoryDto: UpdateSubcategoryDto, file: Express.Multer.File) {
		const branch = this.clsService.get("branch");

		const subcategory = await this.findOne(id);

		Object.keys(updateCategoryDto).forEach((key) => {
			if (isNotEmpty(updateCategoryDto[key])) {
				subcategory[key] = updateCategoryDto[key];
			}
		});

		const menu = await this.getMenu(subcategory.id);
		if (file) subcategory.image = await this.uploadService.uploadImage(file, `Menus/${menu.id}/Subcategories/${subcategory.id}/`);

		try {
			await this.subcategoryRepository.save(subcategory);
		} catch {
			throw new BadRequestException_C(ErrorList.InternalError);
		}

		return subcategory;
	}

	async save(subcategory: Subcategory) {
		return await this.subcategoryRepository.save(subcategory);
	}

	async findAllWithFilter(filter: FilterSubcategoryDTO) {
		const { menuId, categoryId } = filter;

		let menu: Menu = null;
		let category: Category = null;

		let query: any = {};

		if (categoryId && !isNaN(categoryId)) {
			category = await this.categoryService.findOne(categoryId);
			query.category = category;
		}

		if (menuId && !isNaN(menuId)) {
			menu = await this.menuService.findOne(menuId);
			if (!categoryId) query.category = { menu: { id: menu.id } };
			else query.category.menu = { id: menu.id };
		}

		const subcategories = await this.subcategoryRepository.find({
			where: {
				...query,
				enabled: true,
			},
			relations: ["products", "category", "category.menu"],
			order: {
				name: "ASC",
				products: { name: "ASC" },
				category: { name: "ASC", menu: { name: "ASC" } },
			},
		});

		return subcategories;
	}

	async permanentRemove(id: number) {
		const subcategory = await this.subcategoryRepository.findOne({
			where: { id },
			withDeleted: true,
		});
		if (!subcategory) throw new NotFoundException_C(ErrorList.SubcategoryNotFound);
		return this.subcategoryRepository.remove(subcategory);
	}
}
