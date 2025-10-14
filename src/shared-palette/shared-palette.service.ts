import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SharedPalette } from "./entities/shared-palette.entity";
import { CreateSharedPaletteDTO } from "./dtos/create-shared-palette.dto";
import { UpdateSharedPaletteDTO } from "./dtos/update-shared-palette.dto";
import { BadRequestException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";

@Injectable()
export class SharedPaletteService {
	constructor(@InjectRepository(SharedPalette) private sharedPaletteRepository: Repository<SharedPalette>) {}

	async create(sharedPaletteCreate: CreateSharedPaletteDTO) {
		const sharedPaletteCreated = this.sharedPaletteRepository.create(sharedPaletteCreate);

		return this.sharedPaletteRepository.save(sharedPaletteCreated);
	}

	async update(id: number, updateSharedPalette: UpdateSharedPaletteDTO) {
		const sharedPaletteFinded = await this.findOne(id);

		Object.assign(sharedPaletteFinded, updateSharedPalette);

		return await this.sharedPaletteRepository.save(sharedPaletteFinded);
	}

	async findOne(id: number) {
		const sharedPaletteFinded = await this.sharedPaletteRepository.findOne({ where: { id }, order: { id: "ASC" } });

		if (!sharedPaletteFinded) throw new BadRequestException_C(ErrorList.SharedPaletteNotFound);

		return sharedPaletteFinded;
	}

	async findAll(enabled = false) {
		return await this.sharedPaletteRepository.find({
			where: {
				enabled: enabled ? true : undefined,
			},
			order: {
				id: "ASC",
			},
		});
	}

	async delete(id: number) {
		const sharedPalette = await this.findOne(id);

		return await this.sharedPaletteRepository.softRemove(sharedPalette);
	}
}
