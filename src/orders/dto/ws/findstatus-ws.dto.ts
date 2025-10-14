import { IsNotEmpty, IsString } from "class-validator";

export class FindStatusWSDTO {
	@IsNotEmpty()
	@IsString()
	type: string;

	@IsNotEmpty()
	@IsString()
	status: string;
}
