import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { Schedule } from "./entities/schedule.entity";
import { Repository } from "typeorm";
import { NotFoundException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { CreateScheduleDTO } from "./dtos/create-schedule.dto";
import { UpdateScheduleDTO } from "./dtos/update-schedule.dto";

@Injectable()
export class ScheduleService {
	constructor(
		@InjectRepository(Schedule) private scheduleRepository: Repository<Schedule>,
		@Inject(forwardRef(() => ClsService)) private clsService: ClsService,
	) {}

	async findAll() {
		const branch = this.clsService.get("branch");
		const schedules = await this.scheduleRepository.find({
			where: {
				branch: {
					id: branch.id,
				},
				promotion: null,
			},
			order: {
				days: "ASC",
			},
		});

		if (!schedules) throw new NotFoundException_C(ErrorList.ScheduleNotFound);

		return schedules;
	}

	async findOne(id: number) {
		const branch = this.clsService.get("branch");
		const schedule = await this.scheduleRepository.findOne({
			where: {
				id,
				branch: {
					id: branch.id,
				},
				promotion: null,
			},
			order: {
				days: "ASC",
			},
		});

		if (!schedule) throw new NotFoundException_C(ErrorList.ScheduleNotFound);

		return schedule;
	}

	async create(schedules: CreateScheduleDTO[]) {
		const branch = this.clsService.get("branch");

		const schedulesArray: Schedule[] = [];

		for (const schedule of schedules) {
			const scheduleCreated = this.scheduleRepository.create({
				...schedule,
				branch,
			});
			schedulesArray.push(scheduleCreated);
		}

		const schedulesSaved = await this.scheduleRepository.save(schedulesArray);

		return schedulesSaved;
	}

	async update(updateSchedule: UpdateScheduleDTO[]) {
		const scheduleArray: Schedule[] = [];

		for (const schedule of updateSchedule) {
			const scheduleFinded = await this.findOne(schedule.id);
			Object.assign(scheduleFinded, schedule);
			const scheduleSaved = await this.scheduleRepository.save(scheduleFinded);
			scheduleArray.push(scheduleSaved);
		}

		return scheduleArray;
	}

	async delete(id: number) {
		const schedule = await this.findOne(id);

		return await this.scheduleRepository.softRemove(schedule);
	}

	async save(schedule: Schedule) {
		return await this.scheduleRepository.save(schedule);
	}

	async createDirect(schedule: Schedule) {
		return await this.scheduleRepository.save(schedule);
	}
}
