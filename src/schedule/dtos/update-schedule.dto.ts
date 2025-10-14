import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BaseScheduleDTO } from "./base-schedule.dto";

export class UpdateScheduleDTO extends BaseScheduleDTO {
	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ example: 1 })
	id: number;
}
