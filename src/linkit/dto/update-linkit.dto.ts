import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateLinkitDTO } from "./create-linkit.dto";
import { IsBoolean, IsOptional } from "class-validator";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class UpdateLinkitDTO extends PartialType(CreateLinkitDTO) {
	@IsBoolean()
	@ToBoolean()
	@ApiProperty()
	@IsOptional()
	enabled: boolean;
}
