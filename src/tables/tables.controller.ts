import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Version } from "@nestjs/common";
import { TablesService } from "./tables.service";
import { CreateTableDto } from "./dto/create-table.dto";
import { UpdateTableDto } from "./dto/update-table.dto";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiProperty, ApiTags } from "@nestjs/swagger";
import { Public } from "src/common/decorators/public.decorator";
import { validateDTO } from "src/common/tools/validate-dto.tool";
import { Table } from "./entities/table.entity";

@ApiTags("Tables")
@Controller("public/businesses/{businessid}/branches/{branchid}/table")
@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
@ApiBearerAuth("Authorization")
export class TablesController {
	constructor(private readonly tablesService: TablesService) {}

	@Post()
	//@Public()
	@ApiOperation({ summary: "Create table" })
	@Version("1")
	async create() {
		const table = await this.tablesService.create({
			enabled: true,
			nro_mesa: null,
		} as CreateTableDto);
		return this.tablesService.filterTableResponse(table);
	}

	@Get()
	//@Public()
	@ApiOperation({ summary: "Find all tables" })
	@Version("1")
	async findAll() {
		const tables = await this.tablesService.findAll();
		const tables_filtered: any[] = [];
		tables.forEach((table) => {
			tables_filtered.push(this.tablesService.filterTableResponse(table));
		});

		return tables_filtered;
	}

	@Get(":id")
	@ApiOperation({ summary: "Find selected table" })
	@Version("1")
	async findOne(@Param("id") id: number) {
		const table = await this.tablesService.findOne(id);
		return this.tablesService.filterTableResponse(table);
	}

	@Put(":id")
	@ApiOperation({ summary: "Activate table" })
	@Version("1")
	async update(@Param("id") id: number) {
		const table = await this.tablesService.update(id);
		return this.tablesService.filterTableResponse(table);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Delete table" })
	@Version("1")
	async remove(@Param("id") id: number) {
		const table = await this.tablesService.remove(id);
		return this.tablesService.filterTableResponse(table);
	}
}
