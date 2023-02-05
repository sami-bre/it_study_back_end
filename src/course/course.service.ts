import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseDto } from './dto.course';

@Injectable()
export class CourseService {
    constructor(private prisma: PrismaService,) {}

    async getAllCourses() {
        return await this.prisma.course.findMany({
            where: {}
        })
    }

    async getUserCourses(userId: number) {
        let user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }, 
            include: {
                courses: true,
                createdCourses: true,
            }
        })
        return {'created': user.createdCourses, 'registeredFor': user.courses}
    }

    async createCourse(dto: CourseDto, userId: number) {
        let newCourse = await this.prisma.course.create({
            data: {
                authorId: userId,
                name: dto.name,
                description: dto.description
            }
        });
        return newCourse
    }

    async updateCourse(courseId: number, user: any, dto: CourseDto) {
        // verify user is the author of the course.
        let course = await this.getCourseById(courseId)
        if(!(course.authorId == user.id)) {
            throw new ForbiddenException("User is not the author of the course. Only the author can update")
        }
        // then update
        let updatedCourse = await this.prisma.course.update({
            where: {
                id: courseId,
            },
            data: {
                name: dto.name,
                description: dto.description
            }
        })

        return updatedCourse;
    }

    async deleteCourse(courseId: number, user: any) {
        // first verify if user is owner if the course
        let course = await this.getCourseById(courseId)
        if(course.authorId != user.id) {
            throw new ForbiddenException("User is not the author of the course. Only the author can delete")
        }
        // then delete the course
        let deletedCourse = await this.prisma.course.delete({
            where: {id: courseId}
        })
        return deletedCourse
    }

    async getCourseById(courseId: number) {
        let course = await this.prisma.course.findUnique({
            where: {id: courseId},
        })
        if(!course) {
            throw new NotFoundException("the course does not exist")
        }
        return course
    }
}
