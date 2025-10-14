import { Body, Controller, Delete, Param, Patch, Post, Put, Version } from "@nestjs/common";
import { CreateOrderProductDto } from "./dto/create-order-product.dto";
import { OrderProductService } from "./order-product.service";
import { UpdateOrderProductDto } from "./dto/update-order-product.dto";
import { Public } from "src/common/decorators/public.decorator";
import { DeleteOrderProductDto } from "./dto/delete-order-product.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { validateDTO } from "src/common/tools/validate-dto.tool";

@ApiTags("OrderProducts")
@Controller("public/businesses/{businessid}/branches/{branchid}/OrderProduct")
@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
@ApiBearerAuth("Authorization")
export class OrderProductController {
	constructor(private orderProductService: OrderProductService) {}

	//@Public()
	@ApiOperation({ summary: "Update OrderProduct values" })
	@ApiBody({ type: UpdateOrderProductDto })
	@Patch(":id")
	@Version("1")
	async update(@Param("id") id: number, @Body() updateOrderProductDto: UpdateOrderProductDto) {
		await validateDTO(updateOrderProductDto, UpdateOrderProductDto);
		return await this.orderProductService.update(id, updateOrderProductDto);
	}

	@ApiOperation({ summary: "Create a new OrderProduct" })
	@ApiBody({ type: CreateOrderProductDto })
	//@Public()
	@Post()
	@Version("1")
	async create(@Body() createOrderProductDto: CreateOrderProductDto) {
		await validateDTO(createOrderProductDto, CreateOrderProductDto);
		return await this.orderProductService.create(createOrderProductDto);
	}

	//@Public()
	@ApiOperation({ summary: "Delete a OrderProduct" })
	@ApiBody({ type: DeleteOrderProductDto })
	@Delete(":id")
	@Version("1")
	async delete(@Param("id") id: number) {
		return await this.orderProductService.delete(id);
	}
}
