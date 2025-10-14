import { forwardRef, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { BadRequestException_C } from "../Custom/http-response";
import { ErrorList } from "../enums/error.enum";
import { ClsService } from "nestjs-cls";
import { BranchService } from "src/branch/branch.service";
import { BusinessService } from "src/business/business.service";
import { isNotEmpty, isNumber } from "class-validator";

@Injectable()
export class PrefixMiddleware implements NestMiddleware {
	constructor(
		private clsService: ClsService,
		@Inject(forwardRef(() => BranchService)) private branchService: BranchService,
		@Inject(forwardRef(() => BusinessService)) private businessService: BusinessService,
	) {}
	async use(req: any, res: any, next: (error?: Error | any) => void) {
		this.clsService.run(async () => {
			const urlSplitted = req.url.split("/");

			if (!urlSplitted.includes("businesses") && !urlSplitted.includes("branches")) {
				next();
				return;
			}

			//req.url = "/" + urlSplitted.slice(5).join("/");
			const branchId = urlSplitted[urlSplitted.indexOf("branches") + 1];
			const businessId = urlSplitted[urlSplitted.indexOf("businesses") + 1];
			const branchIdNumber = Number(branchId);
			const businessIdNumber = Number(businessId);

			const isBranchIdNumber = !isNaN(branchIdNumber);
			const isBusinessIdNumber = !isNaN(businessIdNumber);

			let branch = null;
			let business = null;

			try {
				if (isBranchIdNumber && isNotEmpty(businessId)) branch = await this.branchService.findOneWithBusiness(branchIdNumber, businessIdNumber);
			} catch {}

			try {
				if (isBusinessIdNumber && isNotEmpty(businessId)) business = await this.businessService.findOne(businessIdNumber);
			} catch {}

			this.clsService.set("branch", branch);
			this.clsService.set("business", business);

			next();
		});
	}
}
