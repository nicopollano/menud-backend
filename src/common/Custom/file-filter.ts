import { memoryStorage } from "multer";

export const fileFilter = (req, file, callback) => {
	const allowed = ["image/jpeg", "image/png", "image/jpg"];
	if (allowed.includes(file.mimetype)) {
		callback(null, true);
		return;
	}
	callback(null, false);
};
