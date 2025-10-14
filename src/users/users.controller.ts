import { Body, Controller, Get, Param, Patch, Post, Query, Version } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UpdateUserDTO } from "./dto/update-user.dto";

@ApiBearerAuth("Authorization")
@Controller("public/users")
@ApiTags("Users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: "Find user by id" })
	@Get(":id")
	@Version("1")
	async findById(@Param("id") id: number) {
		return await this.usersService.findOne(id, false);
	}

	@Version("1")
	@Patch()
	@ApiParam({ name: "id", example: "{{id}}", required: true, description: "User ID" })
	@ApiOperation({ summary: "Update user" })
	async update(@Body() updateUserDTO: UpdateUserDTO) {
		const user = await this.usersService.update(updateUserDTO);
		return {
			id: user.id,
			name: user.name,
			surname: user.surname,
			email: user.email,
			phone: user.phone,
		};
	}
}

@ApiBearerAuth("Authorization")
@Controller("private/users")
@ApiTags("Users")
export class UsersControllerPrivate {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: "Find user by id" })
	@Get(":id")
	@Version("1")
	async findById(@Param("id") id: number) {
		return await this.usersService.findOneAdmin(id);
	}

	@Version("1")
	@Patch()
	@ApiOperation({ summary: "Update user" })
	async update(@Body() updateUserDTO: UpdateUserDTO) {
		const user = await this.usersService.update(updateUserDTO);
		return {
			id: user.id,
			name: user.name,
			surname: user.surname,
			email: user.email,
			phone: user.phone,
		};
	}
}

/*
@ApiTags('Users')
@ApiBearerAuth('Authorization')
@Controller('public/businesses/:businessid/branches/:branchid/users')
@ApiParam({ name: 'businessid', example: "{{businessid}}",required: true, description: 'Business ID' })
@ApiParam({ name: 'branchid', example: "{{branchid}}",required: true, description: 'Branch ID' })
export class UsersControllerPublic {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Find user by id"})
  @Get(":id")
  @Version('1')
  async findById(@Param("id") id: number){
    return await this.usersService.findOne(id);
  }
}
*/
