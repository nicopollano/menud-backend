import { Injectable } from "@nestjs/common";
import { WebSocketServerGateway } from "./websocker.gateway";
import { NotificationMap, NotificationType } from "src/common/enums/notification.enum";

@Injectable()
export class WebSocketServerService {
	constructor(private webSocket: WebSocketServerGateway) {}

	async notification(not: NotificationType, data: any) {
		const notification = NotificationMap[not];
		this.webSocket.broadcastMessage(notification.code, notification.description, data);
		return data;
	}
}
