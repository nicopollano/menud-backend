import { HttpException, HttpStatus } from "@nestjs/common";

export class BadRequestException_C extends HttpException {
	constructor(error: any) {
		const arr = JSON.stringify(error);
		super(
			{
				message: arr,
			},
			HttpStatus.BAD_REQUEST,
		);
	}
}

export class NotFoundException_C extends HttpException {
	constructor(error: any) {
		const arr = JSON.stringify(error);
		super(
			{
				message: arr,
			},
			HttpStatus.NOT_FOUND,
		);
	}
}

export class UnauthorizedException_C extends HttpException {
	constructor(error: any) {
		const arr = JSON.stringify(error);
		super(
			{
				message: arr,
			},
			HttpStatus.UNAUTHORIZED,
		);
	}
}

export class InternalServerErrorException_C extends HttpException {
	constructor(error: any) {
		const arr = JSON.stringify(error);
		super(
			{
				message: arr,
			},
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}
}
