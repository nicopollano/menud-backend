import { SetMetadata } from "@nestjs/common";
import { ModuleKey } from "../enums/modules.enum";

export const MODULE_KEY = "module";

export const ModuleName = (...modules: ModuleKey[]) => SetMetadata(MODULE_KEY, modules);