import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from "@nestjs/websockets";
import { OrderProductService } from "./order-product.service";
//import { CreateOrderAndOrderProductDto } from './dto/create-order-product.dto';
import { Socket, Server } from "socket.io";
import { UseInterceptors, UseFilters, UseGuards } from "@nestjs/common";
import { WsJwtGuard } from "src/common/guards/wss.guard";

@WebSocketGateway({
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
})
/*@UseInterceptors(WsExceptionsInterceptor)
@UseFilters(WsExceptionsFilter)*/
export class OrderProductGateway {
	@WebSocketServer() server: Server;
	constructor(private readonly orderProductService: OrderProductService) {}

	/*@SubscribeMessage('createOrderProduct')
  async create(
    @MessageBody() createOrderAndOrderProductDto: CreateOrderAndOrderProductDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const orderProduct = await this.orderProductService.create(
        createOrderAndOrderProductDto,
      );

      const orders = await this.orderProductService.findAll();
      this.server.emit('findAllOrderProduct', orders);

      client.emit('orderProductCreated', orderProduct);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('findAllOrderProduct')
  findAll() {
    return this.orderProductService.findAll();
  }

  @SubscribeMessage('findOneOrderProduct')
  findOne(@MessageBody() id: number) {
    return this.orderProductService.findOne(id);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('removeOrderProduct')
  async remove(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    try {
      await this.orderProductService.remove(id);
      const orders = await this.orderProductService.findAll();
      this.server.emit('findAllOrderProduct', orders);
      client.emit('orderProductRemoved', id);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
  */
}
