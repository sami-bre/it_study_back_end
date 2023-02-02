import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UserModule, CourseModule, AuthModule, PrismaModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
