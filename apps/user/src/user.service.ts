import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { md5 } from './utils';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password-dto';

@Injectable()
export class UserService {
  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  private logger = new Logger();

  async register(registerUserDto: RegisterUserDto) {
    const captcha = await this.redisService.get(
      `captcha_${registerUserDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }

    if (captcha !== registerUserDto.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        username: registerUserDto.username,
      },
    });

    if (user) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.prismaService.user.create({
        data: {
          username: registerUserDto.username,
          password: md5(registerUserDto.password),
          email: registerUserDto.email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createTime: true,
        },
      });
    } catch (error) {
      this.logger.error(error, UserService);
      return null;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginUserDto.username,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (user.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createTime: user.createTime,
    };
  }

  async updatePassword(passwordDto: UpdateUserPasswordDto) {
    const captcha = await this.redisService.get(
      `update_password_captcha_${passwordDto.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }

    if (captcha !== passwordDto.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        username: passwordDto.username,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    user.password = md5(passwordDto.password);

    try {
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: user,
      });

      return '密码修改成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '密码修改失败';
    }
  }
}
