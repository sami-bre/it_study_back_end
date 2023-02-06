import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SignUpDto, UserUpdateDto } from '../auth/auth.dto'
import { prisma } from '@prisma/client';
import { UserService } from './user.service';
import { CourseService } from 'src/course/course.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService, private courseService: CourseService) {}

    @UseGuards(AuthGuard("jwt"))
    @Get('me')
    getMe(@Req() req: Request) {
        // we just return the currently logged in user object
        return req.user
    }

    @UseGuards(AuthGuard("jwt"))
    @Get(':id')
    getUser(@Param('id', new ParseIntPipe()) id: number) {
        console.log(id)
        return this.userService.getUser(id)
    }

    @Post()
    createUser(@Body() dto: SignUpDto) {
        return this.userService.createUser(dto)
    }

    @UseGuards(AuthGuard("jwt"))
    @Put()
    updateUser(@Body() dto: UserUpdateDto, @Req() req: Request) {
        return this.userService.updateUSer(dto, req.user['id'])
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/me')
    deleteUser(@Req() req: Request) {
        return this.userService.deleteUser(req.user['id'])
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id/courses')
    getUserCourses(@Param('id', new ParseIntPipe()) id: number) {
        return this.courseService.getUserCourses(id)
    }
}
