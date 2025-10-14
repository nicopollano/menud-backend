import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BaseImportProductsDTO {
	@IsNumber()
	categoryId: number;

	@IsNumber()
	subCategoryId: number;

	/*
    @IsNumber()
    menuId: number;
    */
}
