import { Controller, Get, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { LinkitService } from "./linkit.service";
import { ClsService } from "nestjs-cls";
import { User } from "src/users/entities/user.entity";

@Controller("public/linkits")
@ApiTags("Linkit")
@ApiBearerAuth("Authorization")
export class LinkitFindAllController {
  constructor(
    private readonly linkitService: LinkitService,
    private readonly clsService: ClsService
  ) {}

  @Get()
  @Version("1")
  async findAll() {
    const user = this.clsService.get<User>("user");
    return await this.linkitService.findAllByUserId(user.id);
  }
}
