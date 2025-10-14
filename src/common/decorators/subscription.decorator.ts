import { SetMetadata } from "@nestjs/common";
import { SubscriptionActionsEnum } from "../enums/subscription-action.enum";

const SUBSCRIPTION_ACTION_KEY = "subscriptionAction";

export const SubscriptionAction = (...actions: (keyof typeof SubscriptionActionsEnum)[]) => SetMetadata(SUBSCRIPTION_ACTION_KEY, actions);
