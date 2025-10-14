import { PartialType } from "@nestjs/swagger";
import { BasePaletteDTO } from "./base-palette.dto";

export class UpdatePaletteDTO extends PartialType(BasePaletteDTO) {}
