import { Socket as SocketIo } from "socket.io";
import { Socket } from "socket.io-client";

export const wsResponse = function (client: Socket | SocketIo, data: any, error: boolean) {
	const message = {
		statusCode: 200,
		data: null,
		error: null,
	};

	if (error) {
		try {
			message.error = JSON.parse(data.response?.message);
		} catch {
			message.error = data.message;
		}
		message.statusCode = data.status;
	} else message.data = data;

	client.emit("message", message);
};
