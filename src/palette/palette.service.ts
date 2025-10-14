import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MenuPalette } from "./entities/menu-palette.entity";
import { Repository } from "typeorm";
import { BadRequestException_C, NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { CreatePaletteDTO } from "./dtos/create-palette.dto";
import { UpdatePaletteDTO } from "./dtos/update-palette.dto";
import { ClsService } from "nestjs-cls";
import { Branch } from "src/branch/entities/branch.entity";
import { MenuService } from "src/menu/menu.service";

@Injectable()
export class PaletteService {
	constructor(
		@InjectRepository(MenuPalette) private palettesRepository: Repository<MenuPalette>,
		@Inject(forwardRef(() => MenuService)) private menuService: MenuService,
		private clsService: ClsService,
	) {}

	async findOne(paletteId: number) {
		const branch: Branch = this.clsService.get("branch");
		const palettes = await this.palettesRepository.findOne({
			where: {
				id: paletteId,
				menu: {
					branch: {
						id: branch.id,
					},
				},
			},
			relations: ["menu.branch"],
			order: {
				id: "ASC",
			},
		});

		if (!palettes) throw new NotFoundException_C(ErrorList.PaletteNotFount);

		return palettes;
	}

	async findAll() {
		const branch: Branch = this.clsService.get("branch");

		const palettes = await this.palettesRepository.find({
			where: {
				menu: {
					branch: {
						id: branch.id,
					},
				},
			},
			order: {
				id: "ASC",
			},
		});

		if (!palettes) throw new NotFoundException_C(ErrorList.PaletteNotFount);

		return palettes;
	}

	async create(createPalette: Partial<CreatePaletteDTO>) {
		const { menuId, ...createPaletteRest } = createPalette;

		const palette = await this.palettesRepository.create(createPaletteRest);

		if (menuId) {
			const menu = await this.menuService.findOne(menuId);
			const paletteEnabledExists = menu.menuPalettes.find((mP) => mP.enabled);
			palette.menu = menu;

			palette.enabled = !!!paletteEnabledExists;
		}

		return await this.palettesRepository.save(palette);
	}

	async copyPaletteToMenu(createPalettes: Partial<CreatePaletteDTO[]>) {
		if (createPalettes.length == 0) return null;

		const menu = createPalettes[0].menuId ? await this.menuService.findOne(createPalettes[0].menuId) : null;
		const palettes: MenuPalette[] = [];

		createPalettes.map(async (createPalette) => {
			const { menuId, ...createPaletteRest } = createPalette;

			const palette = await this.palettesRepository.create(createPaletteRest);

			const paletteEnabledExists = menu?.menuPalettes.find((mP) => mP.enabled);

			palette.menu = menu;

			palette.enabled = !!!paletteEnabledExists;

			palettes.push(palette);
		});

		return await this.palettesRepository.save(palettes);
	}

	async createDirect(params: MenuPalette) {
		const palette = await this.palettesRepository.create(params);
		return await this.palettesRepository.save(palette);
	}

	async update(paletteId: number, updatePalette: UpdatePaletteDTO) {
		const { color1, color2, color3, enabled } = updatePalette;

		const palettes = await this.findOne(paletteId);

		palettes.color1 = color1;
		palettes.color2 = color2;
		palettes.color3 = color3;
		palettes.enabled = enabled;

		if (enabled) {
			const allPalettes = await this.findAll();
			allPalettes.forEach((palette) => (palette.enabled = false));
			await this.palettesRepository.save(allPalettes);
		}

		return await this.palettesRepository.save(palettes);
	}

	async delete(paletteId: number) {
		const palettes = await this.findOne(paletteId);

		return await this.palettesRepository.softRemove(palettes);
	}
}
