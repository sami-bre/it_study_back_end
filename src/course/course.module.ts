import { Module, forwardRef } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
