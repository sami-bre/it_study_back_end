import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { timeStamp } from 'console';
import { AuthGuard } from '@nestjs/passport';
import { CourseDto } from './dto.course';
import { Request } from 'express';

@Controller('courses')
export class CourseController {
    constructor(private courseService: CourseService) {}

    @Get()
    getAllCources() {
        return this. courseService.getAllCourses()
    }

    @UseGuards(AuthGuard("jwt"))
    @Post()
    async createCourse(@Body() dto: CourseDto, @Req() req: Request) {
        return await this.courseService.createCourse(dto, req.user['id'])
    }

    /**
     * a controller to update only the name or description of a course. it must be the author
     * who sends the update request or it won't work.
     */
    @UseGuards(AuthGuard("jwt"))
    @Patch(':id')
    updateCourse(@Param('id', new ParseIntPipe()) id: number, @Req() req: Request, @Body() dto: CourseDto) {
        return this.courseService.updateCourse(id, req.user, dto)
    }
}
