import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { SignUpDto } from 'src/auth/auth.dto';
import { UserUpdateDto } from './dto.user';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async getUser(userId: number) {
    let user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`no user found with id ${userId}`);
    }
    delete user.hash;
    return user;
  }

  async createUser(dto: SignUpDto): Promise<{ token: string }> {
    // generate a dto
    let passwordHash = await argon.hash(dto.password);
    // add the new user
    let newUser: User;
    try {
      newUser = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          emailAddress: dto.email,
          hash: passwordHash,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
    // we want to delete the the password hash
    delete newUser.hash;
    // and then return the new user
    let token = await this.authService.signToken(
      newUser.id,
      newUser.emailAddress,
    );
    return { token };
  }

  async updateUSer(dto: UserUpdateDto, userId: number) {
    let updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        emailAddress: dto.email,
      },
    });
    delete updatedUser.hash;
    return updatedUser;
  }

  async deleteUser(userId: number) {
    let deletedUser = await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
    delete deletedUser.hash;
    return deletedUser;
  }
}
