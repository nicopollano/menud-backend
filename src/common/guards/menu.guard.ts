import { CanActivate, ExecutionContext, forwardRef, Inject } from "@nestjs/common";
import { MenuService } from "src/menu/menu.service";
import { BadRequestException_C } from "../Custom/http-response";
import { ErrorList } from "../enums/error.enum";
import { Reflector } from "@nestjs/core";

export class MenuGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const menuKey = this.reflector.getAllAndOverride<string>("isMenuRequired", [context.getClass(), context.getHandler()]);
    
    if (!menuKey) return true;

    const request = context.switchToHttp().getRequest();
    const menuId = request.params.menuId;

    if (!menuId) throw new BadRequestException_C(ErrorList.MenuIdRequired);

    return true;
  }
}