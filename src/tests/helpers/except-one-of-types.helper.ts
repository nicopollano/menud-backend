export function expectOneOfTypes(value: any, types: (Function | "null" | "undefined" | string)[]): void {
	const errors: string[] = [];

	const matches = types.some((type) => {
		if (type === String) {
			if (typeof value === "string") return true;
			errors.push(`Expected string, got ${typeof value}`);
			return false;
		}

		if (type === Number) {
			if (typeof value === "number") return true;
			errors.push(`Expected number, got ${typeof value}`);
			return false;
		}

		if (type === Boolean) {
			if (typeof value === "boolean") return true;
			errors.push(`Expected boolean, got ${typeof value}`);
			return false;
		}

		if (type === Date) {
			if (value instanceof Date && !isNaN(value.getTime())) return true;
			if (typeof value === "string" && !isNaN(Date.parse(value))) return true;
			errors.push(`Expected date or ISO string, got ${JSON.stringify(value)}`);
			return false;
		}

		if (type === "null") {
			if (value === null) return true;
			errors.push(`Expected null, got ${typeof value}`);
			return false;
		}

		if (type === "undefined") {
			if (value === undefined) return true;
			errors.push(`Expected undefined, got ${typeof value}`);
			return false;
		}

		// Soporte para "array:ClassName"
		if (typeof type === "string" && type.startsWith("array:")) {
			const classRefName = type.split(":")[1];
			const clazz = globalThis[classRefName];
			if (typeof clazz !== "function") {
				errors.push(`Class '${classRefName}' not found on globalThis`);
				return false;
			}
			if (!Array.isArray(value)) {
				errors.push(`Expected array of ${classRefName}, got ${typeof value}`);
				return false;
			}
			const allMatch = value.every((item) => item instanceof clazz);
			if (!allMatch) {
				errors.push(`Not all items in array are instances of ${classRefName}`);
				return false;
			}
			return true;
		}

		// Soporte para "object:ClassName"
		if (typeof type === "string" && type.startsWith("object:")) {
			const classRefName = type.split(":")[1];
			const clazz = globalThis[classRefName];
			if (typeof clazz !== "function") {
				errors.push(`Class '${classRefName}' not found on globalThis`);
				return false;
			}
			if (typeof value !== "object" || value === null || Array.isArray(value)) {
				errors.push(`Expected object shaped like ${classRefName}, got ${typeof value}`);
				return false;
			}
			const instanceProps = Object.getOwnPropertyNames(new clazz());
			const shapeMatches = instanceProps.every((prop) => prop in value);
			if (!shapeMatches) {
				errors.push(`Object does not match shape of ${classRefName}`);
				return false;
			}
			return true;
		}

		// Clase (Function)
		if (typeof type === "function") {
			if (value instanceof type) return true;
			errors.push(`Expected instance of ${type.name}, got ${value?.constructor?.name ?? typeof value}`);
			return false;
		}

		errors.push(`Unknown type: ${String(type)}`);
		return false;
	});

	if (!matches) {
		throw new Error(
			[
				"❌ Value did not match any of the expected types.",
				`Expected one of: ${types.map((t) => (typeof t === "function" ? t.name : t)).join(", ")}`,
				`Received: ${JSON.stringify(value)} (type: ${typeof value})`,
				"Failures:",
				...errors.map((err, i) => `  ${i + 1}. ${err}`),
			].join("\n"),
		);
	}

	expect(matches).toBe(true);
}
