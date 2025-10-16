import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { BadRequestException_C, InternalServerErrorException_C } from "src/common/Custom/http-response";
import { ErrorList } from "src/common/enums/error.enum";
import { ClsService } from "nestjs-cls";
import { Branch } from "src/branch/entities/branch.entity";
import { Business } from "src/business/entities/business.entity";
import { parse } from "fast-csv";
import { Readable } from "stream";
import { BaseProductDto } from "src/product/dto/base-product.dto";
import { config } from "src/config";
import { url } from "inspector";
import { PessimisticLockTransactionRequiredError } from "typeorm";
import axios from "axios";
import { Product } from "src/product/entities/product.entity";
//const sharp = require("sharp");
const ImageKit = require("imagekit");

@Injectable()
export class UploadService {
	private imagekit: any;

	constructor(@Inject(forwardRef(() => ClsService)) private clsService: ClsService) {
		this.imagekit = new ImageKit({
			publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
			privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
			urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
		});
	}

	async uploadImage(file: Express.Multer.File, subfolder: string, logo = false, businessParam: Business = null, branchParam: Branch = null): Promise<string> {
		if (!file) throw new BadRequestException_C(ErrorList.UploadImageNotSpecified);

		//const fileOptimized = await sharp(file.buffer).resize(550).jpeg({ quality: 70 }).toBuffer();

		const filename = file.originalname;
		const branch: Branch = branchParam ?? this.clsService.get("branch");
		const business: Business = businessParam ?? this.clsService.get("business");

		const path = logo
			? `${config.stage}/buk${business.id}/logo/${filename}`
			: `${config.stage}/buk${business.id}/branches/${branch.id}/${subfolder}/${filename}`;

		const result = await this.uploadToImageKit(/*fileOptimized*/ file.buffer, filename, path);
		if (!result || !result.url) {
			throw new InternalServerErrorException_C(ErrorList.UploadError);
		}

		return result.url;
	}

	async copyImage(urlOrigen: string, subfolder: string, logo = false, businessParam: Business = null, branchParam: Branch = null): Promise<string> {
		if (!urlOrigen || urlOrigen == "") return "";
		try {
			const sourceFilePath = this.extractFilePathFromUrl(urlOrigen);
			if (!sourceFilePath) {
				throw new BadRequestException_C(ErrorList.UploadError);
			}

			const filename = sourceFilePath.split("/").pop();

			const branch: Branch = branchParam ?? this.clsService.get("branch");
			const business: Business = businessParam ?? this.clsService.get("business");

			const destinationPath = logo
				? `${config.stage}/buk${business.id}/logo/${filename}`
				: `${config.stage}/buk${business.id}/branches/${branch.id}/${subfolder}/${filename}`;

			const response = await axios.get(urlOrigen, {
				responseType: "arraybuffer",
				timeout: 30000,
				maxRedirects: 5,
				headers: {
					"User-Agent": "Mozilla/5.0 (compatible; ImageCopier/1.0)",
				},
			});

			const imageBuffer = Buffer.from(response.data);

			const result = await this.uploadToImageKit(imageBuffer, filename, destinationPath);
			if (!result || !result.url) {
				throw new InternalServerErrorException_C(ErrorList.UploadError);
			}

			return result.url;
		} catch (err) {
			console.error(`Copy image failed[${urlOrigen}]:`, err.message || err);
		}
	}

	private extractFilePathFromUrl(url: string): string | null {
		try {
			const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
			if (!url.startsWith(urlEndpoint)) {
				return null;
			}

			const filePath = url.replace(urlEndpoint, "");
			return filePath.startsWith("/") ? filePath.substring(1) : filePath;
		} catch (err) {
			console.error("Error extracting file path from URL:", err);
			return null;
		}
	}

	private async uploadToImageKit(buffer: Buffer, filename: string, path: string): Promise<any> {
		try {
			return await this.imagekit.upload({
				file: buffer,
				fileName: filename,
				folder: "/" + path.substring(0, path.lastIndexOf("/")),
				useUniqueFileName: false,
				isPrivateFile: false,
			});
		} catch (err) {
			console.error("Upload to ImageKit failed:", err);
			throw new InternalServerErrorException_C(ErrorList.UploadError);
		}
	}

	async moveFolder(oldFolderPath: string, newFolderPath: string): Promise<void> {
		if (!oldFolderPath || !newFolderPath) return null;
		try {
			await this.imagekit.moveFolder({
				sourceFolderPath: oldFolderPath,
				destinationPath: newFolderPath,
			});
		} catch (err) {
			console.error(`Error moving folder[${oldFolderPath}->${newFolderPath}]:`, err);
		}
	}

	async processCsv(file: Express.Multer.File): Promise<BaseProductDto[]> {
		const data = await this.parseCsv(file.buffer);
		return data;
	}

	async parseCsv(buffer: Buffer): Promise<any[]> {
		return new Promise((resolve, reject) => {
			const rows: any[] = [];
			const stream = Readable.from(buffer.toString());

			stream
				.pipe(parse({ headers: true }))
				.on("data", (row) => {
					const cleanedRow = Object.fromEntries(Object.entries(row).filter(([key, value]) => key.trim() !== "" && value !== null && value !== undefined));

					const isEmptyRow = Object.values(cleanedRow).every((val) => val === "" || val === null || val === undefined);

					if (!isEmptyRow) {
						rows.push(cleanedRow);
					}
				})
				.on("end", () => {
					resolve(rows);
				})
				.on("error", (error) => {
					console.error("Error parsing CSV:", error);
					reject(new BadRequestException("Error al procesar el archivo CSV"));
				});
		});
	}
}
