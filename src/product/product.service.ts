import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";
import { Between, ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/category/entities/category.entity";
import { ErrorList } from "src/common/enums/error.enum";
import { UploadService } from "src/upload/upload.service";
import { BadRequestException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { ClsService } from "nestjs-cls";
import { SubcategoryService } from "src/subcategory/subcategory.service";
import { CategoryService } from "src/category/category.service";
import { Subcategory } from "src/subcategory/entities/subcategory.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { FilterProductParamsDTO } from "./dto/filter-product-params.dto";
import { isArray } from "class-validator";
import { BaseProductDto } from "./dto/base-product.dto";
import { ImportProductsDTO } from "./dto/create-import-menu.dto";
import { Menu } from "src/menu/entities/menu.entity";
import { MenuService } from "src/menu/menu.service";

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		@Inject(forwardRef(() => SubcategoryService)) private subcategoryService: SubcategoryService,
		@Inject(forwardRef(() => CategoryService)) private categoryService: CategoryService,
		@Inject(forwardRef(() => UploadService)) private uploadService: UploadService,
		@Inject(forwardRef(() => MenuService)) private menuService: MenuService,
		private clsService: ClsService,
	) {}

	async create(files: Express.Multer.File[], createProductDto: CreateProductDto) {
		const { name, price, description, discountedPrice, subcategoryId, categoryId } = createProductDto;

		const branch = this.clsService.get("branch");
		/*
		const productFind = await this.productRepository.findOne({
			where: {
				name,
				categories: { branch: branch.id },
				//branch: {
				//	id: branch.id,
				//}, 
			},
			order: {
				name: "ASC",
			},
		});

		if (productFind) throw new BadRequestException_C(ErrorList.ProductAlreadyExist);
		*/
		let subcategoryFind: Subcategory = null;
		let categoryFind: Category = null;

		let product = new Product();

		product.name = name;
		product.price = price;
		product.description = description;

		/* product.branch = branch; */
		product.discountedPrice = discountedPrice;

		try {
			product = await this.productRepository.save(product);
			if (isArray(files)) {
				const urls: string[] = [];
				for (const file of files) {
					if (!file) return;
					const url = await this.uploadService.uploadImage(file, `Menus/Products/${product.id}`);
					urls.push(url);
				}
				await this.productRepository.update(product.id, {
					images: urls,
				});
			}
			if (subcategoryId) {
				if (!categoryId) throw new BadRequestException_C(ErrorList.CategoryIDNotSpecified);
				await this.subcategoryAddProduct(subcategoryId, product.id, categoryId);
			} else if (categoryId) await this.categoryAddProduct(categoryId, product.id);
		} catch (error) {
			await this.productRepository.remove(product);
			throw error;
		}

		return product;
	}

	async createDirect(params: Product) {
		return await this.productRepository.save(params);
	}

	async findAll(filter: FilterProductParamsDTO) {
		const branch = this.clsService.get("branch");
		const { categoryId, subcategoryId, menuId } = filter;

		const params: any = {};

		if (filter.search) {
			params.name = ILike(`%${filter.search}%`);
		}

		if (categoryId) {
			const category = await this.categoryService.findOne(categoryId);
			params.categories = category;
		}

		if (subcategoryId) {
			const subcategory = await this.subcategoryService.findOne(subcategoryId);
			params.subcategories = subcategory;
		}

		if (filter.priceRange) {
			params.price = Between(filter.priceRange[0], filter.priceRange[1]);
		}

		if (menuId) params.menuFilter = menuId;

		try{
		const products = await this.productRepository.find({
			where: menuId
				? [
						{
							enabled: true,
							categories: { menu: { id: menuId, branch: { id: branch.id } } },
						},
						{
							enabled: true,
							subcategories: { category: { menu: { id: menuId } } },
						},
					]
				: {
						...params,
						enabled: true,
						categories: { branch: branch.id },
					},
			relations: {
				categories: true,
				subcategories: true,
			},
			order: {
				name: "ASC",
				categories: { name: "ASC" },
				subcategories: { name: "ASC" },
			},
		});

		return products.map(({ enabled, ...product }) => product);
		}catch(error){
			console.error(error);
		}
	}

	async findOne(id: number, ignoreBranch: boolean = false) {
		const branch = this.clsService.get("branch");
		const product = await this.productRepository.findOne({
			where: [
				{
					id,
					enabled: true,
					categories: { menu: { branch: { id: ignoreBranch ? undefined : branch.id, } }, },
				},
				{
					id,
					enabled: true,
					subcategories: { category: { menu: { branch: { id: ignoreBranch ? undefined : branch.id, } }, }, },
				}
			],
			relations: { categories: true, subcategories: true },
			order: {
				name: "ASC",
			},
			cache: true,
			
		});
		if (!product) throw new NotFoundException_C(ErrorList.ProductNotFound);
		return product;
	}

	async findOneByName(name: string) {
		const branch = this.clsService.get("branch");
		const lowerCaseName = name.toLowerCase();
		const product = await this.productRepository.findOne({
			where: [
				{
					name: ILike(lowerCaseName),
					enabled: true,
					categories: { menu: { branch: { id: branch.id, } }, },
				},
				{
					name: ILike(lowerCaseName),
					enabled: true,
					subcategories: { category: { menu: { branch: { id: branch.id, } }, }, },
				}
			],
			relations: { categories: true, subcategories: true },
			order: {
				name: "ASC",
			},
		});

		if (!product) throw new NotFoundException_C(ErrorList.ProductNotFound);

		return product;
	}

	/*
  async findByCat(id: number) {
    const branch = this.clsService.get("branch");
    const subcategory = await this.subcategoryService.findOne(id);

    const products =  await this.productRepository.find({
      where: {
        enabled: true,
        subcategory,
        branch:{
          id: branch.id
        }
      },
      relations: ["subcategory"]
    });
    if(!products) throw new NotFoundException_C(ErrorList.ProductNotFound);
    return products.map(({enabled, ...product}) => product);
  }
*/
	async update(files: Express.Multer.File[], id: number, updateProductDto: UpdateProductDto) {
		const branch = this.clsService.get("branch");
		const product = await this.productRepository.findOne({
			where: [
				{
					id,
					categories: { menu: { branch: { id: branch.id, } }, },
					
				},
				{
					id,
					subcategories: { category: { menu: { branch: { id: branch.id, } }, }, },
				}
			],
			relations: ["categories.menu", "subcategories.category.menu"],
			order: {
				name: "ASC",
			},
		});

		if (!product) throw new NotFoundException_C(ErrorList.ProductNotFound);

		const { categoryId, subcategoryId, ...updateProductDtoRest } = updateProductDto;

		Object.assign(product, updateProductDtoRest);

		const productSaved = await this.productRepository.save(product);

		if (isArray(files) && files.length > 0) {
			const urls: string[] = [];
			for (const file of files) {
				const url = await this.uploadService.uploadImage(file, `/Menus/Products/${productSaved.id}`);
				urls.push(url);
			}
			product.images = urls;
			await this.productRepository.update(productSaved.id, {
				images: urls,
			});
		}

		if (subcategoryId)
			try {
				if (!categoryId) throw new BadRequestException_C(ErrorList.CategoryIDNotSpecified);

				productSaved.subcategories.push(await this.subcategoryAddProduct(subcategoryId, productSaved.id, categoryId));
			} catch (error) {
				const errorJSON = JSON.parse(error.response.message);
				if (errorJSON.code != ErrorList.SubcategoryProductAlreadyExist.code) throw error;
			}
		else if (categoryId)
			try {
				productSaved.categories.push(await this.categoryAddProduct(categoryId, productSaved.id));
			} catch (error) {
				const errorJSON = JSON.parse(error.response.message);
				if (errorJSON.code != ErrorList.CategoryProductAlreadyExist.code) throw error;
			}

		if (!product) throw new NotFoundException_C(ErrorList.ProductNotFound);
		return product;
	}

	async remove(id: number, categoryid: number, subcategoryid: number) {
		const branch = this.clsService.get("branch");

		const product = await this.productRepository.findOne({
			where: {
				id,
				/* branch: {
					id: branch.id,
				}, */
			},
			order: {
				name: "ASC",
			},
		});

		if (!product) throw new NotFoundException_C(ErrorList.ProductNotFound);

		if (categoryid) return await this.categoryDeleteProduct(categoryid, id);

		if (subcategoryid) return await this.subcategoryDeleteProduct(subcategoryid, id);

		return await this.productRepository.softRemove(product);
	}

	async decrecientTopSeller(limit: number) {
		const branch = this.clsService.get("branch");

		const products = await this.productRepository.find({
			where: {
				enabled: true,
				categories: { menu: { branch: { id: branch.id, } }, },
				/* branch: {
					id: branch.id,
				}, */
			},
			order: {
				sell_count: "DESC",
			},
			take: limit,
		});

		if (!products) throw new NotFoundException_C(ErrorList.ProductNotFound);

		return products.map(({ enabled, ...product }) => product);
	}

	async increaseTopSeller(id: number, quantity: number) {
		const product = await this.findOne(id);
		product.sell_count = product.sell_count + 1;
		await this.productRepository.save(product);
	}

	async categoryAddProduct(categoryid: number, productid: number) {
		const category = await this.categoryService.findOne(categoryid);

		const product = await this.findOne(productid, true);

		if (category.products.find((_product) => _product.id == product.id)) throw new BadRequestException_C(ErrorList.CategoryProductAlreadyExist);

		category.products.push(product);

		return await this.categoryService.save(category);
	}

	async categoryDeleteProduct(categoryid: number, productid: number) {
		const category = await this.categoryService.findOne(categoryid);

		if (!category.products.find((product) => product.id == productid)) throw new BadRequestException_C(ErrorList.CategoryProductNotFound);

		category.products = category.products.filter((product) => product.id != productid);

		return await this.categoryService.save(category);
	}

	async subcategoryAddProduct(subcategoryid: number, productid: number, categoryId: number) {
		const subcategory = await this.subcategoryService.findOne(subcategoryid);
		let product = await this.findOne(productid, true);

		if (!product.id) {
			product = await this.productRepository.save(product);
		}

		if (subcategory.products.find((_product) => _product.id == product.id)) throw new BadRequestException_C(ErrorList.SubcategoryProductAlreadyExist);

		subcategory.products = [...(subcategory.products || []), product];

		return await this.subcategoryService.save(subcategory);
	}

	async subcategoryDeleteProduct(subcategoryid: number, productid: number) {
		const subcategory = await this.subcategoryService.findOne(subcategoryid);

		if (!subcategory.products.find((product) => product.id == productid)) throw new BadRequestException_C(ErrorList.SubcategoryProductNotFound);

		subcategory.products = subcategory.products.filter((product) => product.id != productid);

		return await this.subcategoryService.save(subcategory);
	}

	async import(file: Express.Multer.File, createImportProducts: ImportProductsDTO) {
		if (!file) throw new NotFoundException_C(ErrorList.UploadCsvEmpty);

		const { categoryId, subCategoryId /*, menuId*/ } = createImportProducts;
		const branch: Branch = this.clsService.get("branch");
		const data: BaseProductDto[] = await this.uploadService.processCsv(file);
		const productList: Product[] = [];

		if (subCategoryId && !categoryId) throw new BadRequestException_C(ErrorList.SubcategoryWithoutCategory);

		for (const product of data) {
			let productFinded: Product = null;
			try {
				productFinded = await this.findOneByName(product.name);
			} catch (e) {
				console.log(`Product[ ${product.name} ] not found, creating it`);
				productFinded = await this.create(null, product);
			}
			const productSaved = await this.update(null, productFinded.id, {
				...product,
				visible: true,
				categoryid: categoryId,
				subcategoryid: subCategoryId,
			} as UpdateProductDto);
			productList.push(productSaved);
		}

		const { business, ...branchRest } = branch;

		return {
			branch: branchRest,
			products: productList,
		};
	}

	async permanentRemove(id: number) {
		const product = await this.productRepository.findOne({
			where: { id },
			withDeleted: true,
		});
		if (!product) throw new NotFoundException_C(ErrorList.ProductNotFound);
		return this.productRepository.remove(product);
	}

	async updateProduct(id: number, product: Partial<Product>) {
		return await this.productRepository.update(id, { ...product });	
	}
}
