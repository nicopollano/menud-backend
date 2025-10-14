import { memoryStorage } from "multer";

export const fileInterceptor = {
	fileFilter(req, file, callback) {
		const allowed = ["image/png", "image/jpeg", "image/jpg"];
		if (allowed.includes(file.mimetype)) callback(null, true);
		else callback(null, false);
	},
	storage: memoryStorage(),
};
