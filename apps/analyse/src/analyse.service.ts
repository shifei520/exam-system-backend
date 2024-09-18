import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AnalyseService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  private redisService: RedisService;

  async ranking(examId: number) {
    const answers = await this.prismaService.answer.findMany({
      where: {
        examId,
      },
    });

    for (let i = 0; i < answers.length; i++) {
      await this.redisService.zAdd('ranking:' + examId, {
        [answers[i].id]: answers[i].score,
      });
    }
    const ids = await this.redisService.zRankingList(
      'ranking:' + examId,
      0,
      10,
    );

    const res = [];
    for (let i = 0; i < ids.length; i++) {
      const answer = await this.prismaService.answer.findUnique({
        where: {
          id: +ids[i],
        },
        include: {
          answer: true,
          exam: true,
        },
      });
      res.push(answer);
    }
    return res;
  }
}
