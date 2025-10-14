import { IsNotEmpty, IsString } from "class-validator";

export class SoldMarginWSDTO {
	@IsNotEmpty()
	@IsString()
	from: string;

	@IsNotEmpty()
	@IsString()
	to: string;
}
