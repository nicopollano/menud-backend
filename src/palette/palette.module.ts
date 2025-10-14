import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuPalette } from "./entities/menu-palette.entity";
import { PaletteControllerPrivate, PalettesController } from "./palette.controller";
import { PaletteService } from "./palette.service";
import { SharedPaletteService } from "src/shared-palette/shared-palette.service";
import { SharedPaletteModule } from "src/shared-palette/shared-palette.module";
import { MenuModule } from "src/menu/menu.module";

@Module({
	imports: [TypeOrmModule.forFeature([MenuPalette]), forwardRef(() => SharedPaletteModule), forwardRef(() => MenuModule)],
	controllers: [PalettesController, PaletteControllerPrivate],
	providers: [PaletteService],
	exports: [PaletteService],
})
export class PaletteModule {}
