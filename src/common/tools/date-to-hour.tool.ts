export function dateToHour(date: Date): string {
	const dateStr = date.getHours().toString() + (date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString());
	const dateStrFixed = dateStr.length === 3 ? "0" + dateStr : dateStr;
	return dateStrFixed;
}
