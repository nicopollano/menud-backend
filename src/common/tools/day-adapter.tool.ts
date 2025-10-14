import { Days } from "src/common/enums/days.enum";

export function jsDayToEnumDay(jsDay: number): Days {
	return jsDay === 0 ? Days.Sunday : (jsDay as Days);
}

export function dayNameToEnumDay(dayName: string): Days | undefined {
	switch (dayName) {
		case "Monday":
			return Days.Monday;
		case "Tuesday":
			return Days.Tuesday;
		case "Wednesday":
			return Days.Wednesday;
		case "Thursday":
			return Days.Thursday;
		case "Friday":
			return Days.Friday;
		case "Saturday":
			return Days.Saturday;
		case "Sunday":
			return Days.Sunday;
		default:
			return undefined;
	}
}

export function enumDayToDayName(day: Days): string {
	switch (day) {
		case Days.Monday:
			return "Monday";
		case Days.Tuesday:
			return "Tuesday";
		case Days.Wednesday:
			return "Wednesday";
		case Days.Thursday:
			return "Thursday";
		case Days.Friday:
			return "Friday";
		case Days.Saturday:
			return "Saturday";
		case Days.Sunday:
			return "Sunday";
		default:
			return "";
	}
}
