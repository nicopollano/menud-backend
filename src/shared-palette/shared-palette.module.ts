import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedPalette } from "./entities/shared-palette.entity";
import { SharedPaletteService } from "./shared-palette.service";

@Module({
	imports: [TypeOrmModule.forFeature([SharedPalette])],
	providers: [SharedPaletteService],
	exports: [SharedPaletteService],
})
export class SharedPaletteModule {}
