import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class ScheduleOrdersSoldDTO {
	@IsDate()
	@IsNotEmpty()
	date: Date;

	@IsNumber()
	@IsNotEmpty()
	quantity: number;
}
