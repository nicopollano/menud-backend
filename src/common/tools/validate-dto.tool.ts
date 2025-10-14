import { validate } from "class-validator";
import { BadRequestException_C } from "../Custom/http-response";
import { ErrorList } from "../enums/error.enum";
import { plainToInstance } from "class-transformer";

export async function validateDTO(dto: any, dtoType: any): Promise<any> {
	if (Array.isArray(dto)) {
		const validatedArray = plainToInstance(dtoType, dto, {
			enableImplicitConversion: true,
		});

		const errors = await Promise.all(validatedArray.map((d) => validate(d as object)));

		const flatErrors = errors.flat().filter((e) => Object.keys(e.constraints || {}).length > 0);

		if (flatErrors.length > 0) {
			throw new BadRequestException_C({
				code: "SYSTEM/VALIDATOR",
				message:
					"ClassValidator error: " +
					flatErrors
						.map((error) => {
							return Object.values(error.constraints).join(", ");
						})
						.join("; "),
			});
		}

		return validatedArray;
	} else {
		const validatedObject = plainToInstance(dtoType, dto, {
			enableImplicitConversion: true,
		});

		const errors = await validate(validatedObject);

		if (errors.length > 0) {
			throw new BadRequestException_C({
				code: "SYSTEM/VALIDATOR",
				message:
					"ClassValidator error: " +
					errors
						.map((error) => {
							return Object.values(error.constraints).join(", ");
						})
						.join("; "),
			});
		}

		return validatedObject;
	}
}
