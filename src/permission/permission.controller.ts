import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { Public } from "src/common/decorators/public.decorator";
import { CreatePermissionDTO } from "./dtos/create-permission.dto";
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UpdatePermissionDTO } from "./dtos/update-permission.dto";
import { AddPermissionsByRole } from "./dtos/add-permission-by-role.dto";
import { RoleEnum, RoleKey } from "src/common/enums/role.enum";
import { ClsService } from "nestjs-cls";
import { ModuleName } from "src/common/decorators/module.decorator";

@ApiTags("Permission")
@Controller("public/businesses/:businessid/branches/:branchid/permissions")
@ApiParam({ name: 'businessid', example: "{{businessid}}",required: true, description: 'Business ID' })
@ApiParam({ name: 'branchid', example: "{{branchid}}",required: true, description: 'Branch ID' })
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService,
        private clsService: ClsService,
    ){}

    @Post()
    @Public()
    async create(@Body() addPermissionsByRole: AddPermissionsByRole){
        const {role, userId} = addPermissionsByRole;
        const permission = await this.permissionService.addRolePermissions(userId, role);
        return permission;
    }

    @Patch(":id")
    @ApiParam({ name: "id", example: "{{id}}", required: true, description: "Permission ID" })
    @Public()
    async update(@Param("id") id: number, @Body() updatePermission: UpdatePermissionDTO){
        const permission = await this.permissionService.updateRolePermissions(id, updatePermission);
        return permission;
    }

    @Get(":id")
    @Public()
    async findAll(@Param("id") id: number){
        const permissions = await this.permissionService.findAll(id);
        const permissionFiltered = permissions.map(({branchMember, businessOwner, ...rest}) => rest);
        return permissionFiltered;
    }

    @Delete(":role/:id")
    @ApiParam({ name: "role", example: 1 })
    @ApiParam({ name: "id", example: RoleEnum.owner })
    @Public()
    async delete(@Param("id") id: number, @Param("role") role: RoleKey){
        return await this.permissionService.deleteRolePermissions(id, role);
    }
}