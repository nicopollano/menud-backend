import { IsBoolean, IsNotEmpty } from "class-validator";
import { ToBoolean } from "src/common/tools/to-boolean.tool";

export class UpdateMenuVisibilityDTO {
    @IsBoolean()
    @IsNotEmpty()
    @ToBoolean()
    visibility: boolean;
}