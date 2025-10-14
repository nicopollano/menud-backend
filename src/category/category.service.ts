import { BadRequestException, forwardRef, Inject, Injectable, Query } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { ErrorList } from "src/common/enums/error.enum";
import { UploadService } from "src/upload/upload.service";
import { BadRequestException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { Branch } from "src/branch/entities/branch.entity";
import { ClsService } from "nestjs-cls";
import { ProductService } from "src/product/product.service";
import { MenuService } from "src/menu/menu.service";
import { FilterFindAllDTO } from "./dto/filter-findAll.dto";
import { validateDTO } from "src/common/tools/validate-dto.tool";

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>,
		@Inject(forwardRef(() => UploadService)) private uploadService: UploadService,
		@Inject(forwardRef(() => ProductService)) private productService: ProductService,
		@Inject(forwardRef(() => MenuService)) private menuService: MenuService,
		private clsService: ClsService,
	) {}

	async create(file: Express.Multer.File, createCategoryDto: CreateCategoryDto) {
		const { name, menuId, description } = createCategoryDto;
		const branch = this.clsService.get("branch");
		const menu = await this.menuService.findOne(menuId);
		const category = await this.categoryRepository.create();

		category.name = name;
		category.menu = menu;
		category.description = description;

		try {
			const catSaved = await this.categoryRepository.save(category);
			if (file) {
				if (!file.originalname) file.originalname = `${name}_${(new Date(Date.now())).getMilliseconds()}`;
				category.image = await this.uploadService.uploadImage(file, `Menus/${menuId}/Categories/${catSaved.id}/`);
				await this.categoryRepository.update(catSaved.id, { image: category.image });
			}
			return category;
		} catch (error) {
			console.error(error);
			throw new BadRequestException_C(ErrorList.InternalError);
		}
	}

	async createDirect(params: Partial<Category>) {
		return this.categoryRepository.save(params);
	}

	async findAll(filter: FilterFindAllDTO) {
		const branch: Branch = this.clsService.get("branch");

		const categories = await this.categoryRepository.find({
			where: {
				menu: {
					id: filter.menuId ? filter.menuId : undefined,
					branch: { id: branch.id },
				},
				enabled: filter.enabled,
			},
			relations: ["products", "subcategories.products"],
			order: {
				name: "ASC",
				products: { name: "ASC" },
				subcategories: { name: "ASC", products: { name: "ASC" } },
			},
		});

		if (!categories) throw new NotFoundException_C(ErrorList.CategoryNotFound);

		return categories;
	}

	async findOne(id: number) {
		const branch: Branch = this.clsService.get("branch");
		const category = await this.categoryRepository.findOne({
			where: {
				id,
				menu: { branch: { id: branch.id } },
			},
			relations: ["products", "subcategories", "menu"],
			order: {
				name: "ASC",
				products: { name: "ASC" },
				subcategories: { name: "ASC" },
			},
		});

		if (!category) throw new NotFoundException_C(ErrorList.CategoryNotFound);

		return category;
	}

	async update(id: number, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File) {
		const branch: Branch = this.clsService.get("branch");
		const { name, ...rest } = updateCategoryDto;

		const category = await this.categoryRepository.findOne({
			where: {
				id,
				menu: { branch: { id: branch.id } },
			},
			order: {
				name: "ASC",
			},
		});

		if (!category) throw new NotFoundException_C(ErrorList.CategoryNotFound);

		if (name) {
			category.name = name;
		}

		Object.assign(category, rest);

		if (file) category.image = await this.uploadService.uploadImage(file, `Menus/${updateCategoryDto.menuId}/Categories/${category.id}/`);

		try {
			await this.categoryRepository.save(category);
		} catch {
			throw new BadRequestException_C(ErrorList.InternalError);
		}

		return category;
	}

	async remove(id: number) {
		const branch: Branch = this.clsService.get("branch");

		const category = await this.categoryRepository.findOne({
			where: {
				id,
				menu: { branch: { id: branch.id } },
			},
			order: {
				name: "ASC",
			},
		});

		if (!category) throw new NotFoundException_C(ErrorList.CategoryNotFound);

		await this.categoryRepository.softRemove(category);

		return { message: "Category deleted" };
	}

	async save(category: Category) {
		return await this.categoryRepository.save(category);
	}

	async permanentRemove(id: number) {
		const category = await this.categoryRepository.findOne({
			where: { id },
			withDeleted: true,
		});
		if (!category) throw new NotFoundException_C(ErrorList.CategoryNotFound);
		return this.categoryRepository.remove(category);
	}
}
