import { Schedule } from "src/schedule/entities/schedule.entity";

export function ScheduleDaysAdapter(schedules: Schedule | Schedule[]) {
	if (Array.isArray(schedules)) {
		return schedules
			.filter((schedule) => !schedule.promotion)
			.map((schedule) => ({
				...schedule,
				day: schedule.days?.[0] ?? null,
			}));
	}

	return {
		...schedules,
		day: schedules as Schedule,
	};
}
