import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  // we're using forwardRef() because we have a circular dependancy condition.
  imports: [AuthModule, PrismaModule, CourseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
