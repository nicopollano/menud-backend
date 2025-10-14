import { Transform } from "class-transformer";

export function ToBoolean() {
	return Transform(
		({ obj, key }) => {
			const rawValue = obj[key];
			if (typeof rawValue === "string") {
				const lowered = rawValue.toLowerCase().trim();
				const converted = Boolean(lowered === "true");
				return converted;
			}
			return Boolean(rawValue);
		},
		{ toClassOnly: true },
	);
}
