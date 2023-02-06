import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "let's do it",
    }); 
  }
  
  async validate(payload: {sub: number, email: string}) {
    let user = await this.prisma.user.findUnique({
        where: {emailAddress: payload.email}
    })
    if(!user) {
      // returning none ... authentication fails.
      return user
    }
    delete user.hash
    return user;
  }
}