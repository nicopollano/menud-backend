import { SetMetadata } from "@nestjs/common";

export const PERMISSIVE_KEY = "permissive";

export const Permissive = ()=> SetMetadata(PERMISSIVE_KEY, true);