import { Body, Controller, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { Auth } from "@common/decorator";
import { Types } from "mongoose";
@Controller('admin')
@Auth(['admin'])
export class AdminController {
    constructor(private readonly userService: UserService) { }

    @Post('ban-user/:id')
    async banUser(@Param('id') id: string ) {
        const user = await this.userService.banUser(id)
        return {
            message:"User banned successfully",
            success:true,
            data:user
        }
    }

    @Post('unban-user/:id')
    async unBanUser(@Param('id') id: string) {
        const user = await this.userService.unBanUser(id)
        return {
            message:"User unbanned successfully",
            success:true,
            data:user
        }
    }
    
}