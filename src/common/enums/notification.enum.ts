export const NotificationList = [{ key: "NewOrder", code: "ORDER/CREATED", description: "New order created" }] as const;

export type NotificationType = (typeof NotificationList)[number]["key"];

export const NotificationMap = Object.fromEntries(NotificationList.map((item) => [item.key, item]));
