import { Inject, Injectable } from '@nestjs/common';
import { ExamAddDto } from './dto/exam-add.dto';
import { PrismaService } from '@app/prisma';
import { ExamSaveDto } from './dto/exam-save.dto';

@Injectable()
export class ExamService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  add(examAddDto: ExamAddDto, userId: number) {
    return this.prismaService.exam.create({
      data: {
        name: examAddDto.name,
        content: '',
        createUser: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async list(userId: number, bin: string) {
    return this.prismaService.exam.findMany({
      where:
        bin !== undefined
          ? {
              createUserId: userId,
              isDelete: true,
            }
          : {
              createUserId: userId,
            },
    });
  }

  async delete(userId: number, id: number) {
    return this.prismaService.exam.update({
      where: {
        id,
        createUserId: userId,
      },
      data: {
        isDelete: true,
      },
    });
  }

  async save(examSaveDto: ExamSaveDto) {
    return this.prismaService.exam.update({
      where: {
        id: examSaveDto.id,
      },
      data: {
        content: examSaveDto.content,
      },
    });
  }

  async publish(userId: number, id: number) {
    return this.prismaService.exam.update({
      where: {
        id,
        createUserId: userId,
      },
      data: {
        isPublish: true,
      },
    });
  }

  async unpublish(userId: number, id: number) {
    return this.prismaService.exam.update({
      where: {
        id,
        createUserId: userId,
      },
      data: {
        isPublish: false,
      },
    });
  }

  async find(id: number) {
    return this.prismaService.exam.findUnique({
      where: {
        id,
      },
    });
  }
}
