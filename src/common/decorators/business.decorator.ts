import { SetMetadata } from "@nestjs/common";

export const IS_BUSINESS_REQUIRED_KEY = "isBusinessRequired";

export const BusinessRequired = () => SetMetadata(IS_BUSINESS_REQUIRED_KEY, true);
