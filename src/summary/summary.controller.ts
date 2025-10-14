import { BadRequestException, Controller, Get, Param, Query, Version } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiTags } from "@nestjs/swagger";
import { SummaryService } from "./summary.service";
import { ErrorList } from "src/common/enums/error.enum";
import { BadRequestException_C } from "src/common/Custom/http-response";
import { Public } from "src/common/decorators/public.decorator";

@Controller("public/businesses/{businessid}/branches/{branchid}/summary")
@ApiParam({ name: "businessid", example: "{{businessid}}", required: true, description: "Business ID" })
@ApiParam({ name: "branchid", example: "{{branchid}}", required: true, description: "Branch ID" })
@ApiTags("Summaries")
@ApiBearerAuth("Authorization")
export class SummaryController {
	constructor(private summaryService: SummaryService) {}

	@Get("earning")
	@ApiOperation({ summary: "Gets total earning" })
	@Version("1")
	async earning() {
		return await this.summaryService.earningSummary();
	}

	@Get("orders")
	@ApiOperation({ summary: "Gets total orders" })
	@Version("1")
	async orders() {
		return await this.summaryService.totalOrders();
	}

	@Get("delivered")
	@ApiOperation({ summary: "Gets total delivered orders" })
	@ApiQuery({ enum: ["Total", "GraphicSummary"], type: String, name: "type" })
	//@Public()
	@Version("1")
	async delivered(@Query("type") type: string) {
		switch (type) {
			case "Total":
				return await this.summaryService.totalDelivery();
			case "GraphicSummary":
				return await this.summaryService.totalDeliveryGaphicSummary();
		}
	}

	@Get("sold")
	@ApiOperation({ summary: "Gets total sales" })
	@Version("1")
	async sales() {
		return await this.summaryService.totalSales();
	}

	@Get("sold/:from/:to")
	@ApiOperation({ summary: "Get total sold by date" })
	@ApiParam({ name: "from", type: String, format: "date", description: "YYYY-MM-DD" })
	@ApiParam({ name: "to", type: String, format: "date", description: "YYYY-MM-DD", required: false })
	@Version("1")
	async soldSchedule(@Param("from") from: string, @Param("to") to: string) {
		const fromDate = new Date(from);
		const toDate = new Date(to);

		if (!fromDate.getDate()) throw new BadRequestException_C(ErrorList.SummaryBadRequest);
		return await this.summaryService.soldMargin(fromDate, toDate);
	}

	@Get("top-seller")
	//@Public()
	@ApiOperation({ summary: "Get top seller in decrecient order", description: "Limited to 4 products" })
	@Version("1")
	async decrecientTopSeller() {
		return await this.summaryService.decrecientTopSeller();
	}
}
