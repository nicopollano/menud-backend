import { SetMetadata } from "@nestjs/common";
import { ActionTypes } from "../enums/actions.enum";

export const PERMISSION_KEY = "permission";

export const Permission = (...actions: ActionTypes[]) => SetMetadata(PERMISSION_KEY, actions);
