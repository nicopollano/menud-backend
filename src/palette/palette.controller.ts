import { Body, Controller, Delete, forwardRef, Get, Inject, Param, Patch, Post, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { PaletteService } from "./palette.service";
import { UpdatePaletteDTO } from "./dtos/update-palette.dto";
import { CreatePaletteDTO } from "./dtos/create-palette.dto";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { BranchRequired } from "src/common/decorators/branch.decorator";
import { BusinessRequired } from "src/common/decorators/business.decorator";
import { SharedPaletteService } from "src/shared-palette/shared-palette.service";
import { CreateSharedPaletteDTO } from "src/shared-palette/dtos/create-shared-palette.dto";
import { UpdateSharedPaletteDTO } from "src/shared-palette/dtos/update-shared-palette.dto";

@Controller("public/businesses/:businessid/branches/:branchid/palettes")
@ApiTags("Palettes")
@ApiBearerAuth("Authorization")
@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
@BranchRequired()
@BusinessRequired()
export class PalettesController {
	constructor(private palettesService: PaletteService) {}

	@Get()
	@Version("1")
	@ApiOperation({ summary: "Find all palettes palette" })
	async findAll() {
		return await this.palettesService.findAll();
	}

	@Get(":paletteId")
	@Version("1")
	@ApiOperation({ summary: "Find a palettes palette" })
	async findOne(@Param("paletteId") paletteId: number) {
		return await this.palettesService.findOne(paletteId);
	}

	@Post()
	@Version("1")
	@ApiOperation({ summary: "Create a palettes palette" })
	async create(@Body() createPalette: CreatePaletteDTO) {
		const createPaletteDTO = await validateDTO(createPalette, CreatePaletteDTO);
		const createdPalette = await this.palettesService.create(createPaletteDTO);
		const { menu, ...rest } = createdPalette;
		return rest;
	}

	@Patch(":id")
	@Version("1")
	@ApiOperation({ summary: "Update a palettes palette" })
	async update(@Body() updatePalette: UpdatePaletteDTO, @Param("id") id: number) {
		const updatePaletteDTO = await validateDTO(updatePalette, UpdatePaletteDTO);
		return await this.palettesService.update(id, updatePaletteDTO);
	}

	@Delete(":id")
	@Version("1")
	@ApiOperation({ summary: "Delete a palettes palette" })
	async delete(@Param("id") paletteId: number) {
		return await this.palettesService.delete(paletteId);
	}
}
@Controller("private/palettes")
@ApiTags("Palettes")
@ApiBearerAuth("Authorization")
export class PaletteControllerPrivate {
	constructor(@Inject(forwardRef(() => SharedPaletteService)) private sharedPaletteService: SharedPaletteService) {}

	@Post()
	@Version("1")
	@ApiBody({ type: CreateSharedPaletteDTO })
	async create(@Body() createSharedPalette: CreateSharedPaletteDTO) {
		return await this.sharedPaletteService.create(createSharedPalette);
	}

	@Patch(":id")
	@ApiParam({ name: "id" })
	@ApiBody({ type: UpdateSharedPaletteDTO })
	@Version("1")
	async update(@Param("id") id: number, @Body() updateSharedPalette: UpdateSharedPaletteDTO) {
		return await this.sharedPaletteService.update(id, updateSharedPalette);
	}

	@Get(":id")
	@Version("1")
	async findOne(@Param("id") id: number) {
		return await this.sharedPaletteService.findOne(id);
	}

	@Get()
	@Version("1")
	async findAll() {
		return await this.sharedPaletteService.findAll();
	}

	@Delete(":id")
	@Version("1")
	async delete(@Param("id") id: number) {
		return await this.sharedPaletteService.delete(id);
	}
}
