import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Plan } from "./entities/plan.entity";
import { CreatePlanDTO } from "./dtos/create-plan.dto";
import { BadRequestException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { UpdatePlanDTO } from "./dtos/update-plan.dto";
import { PlanEnum } from "src/common/enums/plan.enum";

@Injectable()
export class PlanService {
	constructor(@InjectRepository(Plan) private readonly planRepository: Repository<Plan>) {}

	async create(createPlanDTO: CreatePlanDTO) {
		const plan = this.planRepository.create(createPlanDTO);

		const savedPlan = await this.planRepository.save(plan);

		if (!savedPlan) throw new BadRequestException_C(ErrorList.PlanNotFound);

		return savedPlan;
	}

	async findAll() {
		const plans = await this.planRepository.find();

		if (!plans) throw new BadRequestException_C(ErrorList.PlanNotFound);

		return plans;
	}

	async findOne(id: number) {
		const plan = await this.planRepository.findOne({ where: { id } });

		if (!plan) throw new BadRequestException_C(ErrorList.PlanNotFound);

		return plan;
	}

	async update(id: number, updatePlanDTO: UpdatePlanDTO) {
		const plan = await this.findOne(id);

		if (!plan) throw new BadRequestException_C(ErrorList.PlanNotFound);

		Object.assign(plan, updatePlanDTO);

		const updatedPlan = await this.planRepository.save(plan);

		return updatedPlan;
	}

	async remove(id: number) {
		const plan = await this.findOne(id);

		if (!plan) throw new BadRequestException_C(ErrorList.PlanNotFound);

		return await this.planRepository.softRemove(plan);
	}

	async getSummary() {
		const plans = await this.planRepository.find();

		if (!plans) throw new BadRequestException_C(ErrorList.PlanNotFound);

		return {
			totalPlans: plans.length,
		};
	}

	async getBasicPlan(){
		const plan = await this.planRepository.findOne({where: { type: PlanEnum.BASIC }});

		if (!plan) throw new BadRequestException_C(ErrorList.PlanNotFound);

		return plan;
	}
}
