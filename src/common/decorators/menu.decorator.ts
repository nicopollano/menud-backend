import { SetMetadata } from "@nestjs/common";

export const IS_MENU_REQUIRED = "isMenuRequired";

export const MenuRequired = () => SetMetadata(IS_MENU_REQUIRED, true);