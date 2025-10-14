import { SetMetadata } from "@nestjs/common";

export const IS_BRANCH_REQUIRED_KEY = "isBranchRequired";

export const BranchRequired = () => SetMetadata(IS_BRANCH_REQUIRED_KEY, true);
