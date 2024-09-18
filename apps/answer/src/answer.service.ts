import { Inject, Injectable } from '@nestjs/common';
import { AnswerAddDto } from './dto/answer-add.dto';
import { PrismaService } from '@app/prisma';

@Injectable()
export class AnswerService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async add(answerAddDto: AnswerAddDto, userId: number) {
    const exam = await this.prismaService.exam.findUnique({
      where: {
        id: answerAddDto.examId,
      },
    });

    let questions = [];
    try {
      questions = JSON.parse(exam.content);
    } catch (error) {}

    let answers = [];
    try {
      answers = JSON.parse(answerAddDto.content);
    } catch (error) {}

    let totalScore = 0;
    answers.forEach((answer) => {
      const question = questions.find((question) => question.id === answer.id);

      if (question.type === 'input') {
        if (answer.answer.includes(question.answer)) {
          totalScore += question.score;
        }
      } else {
        if (answer.answer === question.answer) {
          totalScore += question.score;
        }
      }
    });

    return this.prismaService.answer.create({
      data: {
        content: answerAddDto.content,
        score: totalScore,
        answer: {
          connect: {
            id: userId,
          },
        },
        exam: {
          connect: {
            id: answerAddDto.examId,
          },
        },
      },
    });
  }

  async list(examId: number) {
    return this.prismaService.answer.findMany({
      where: {
        examId,
      },
      include: {
        exam: true,
        answer: true,
      },
    });
  }

  async find(id: number) {
    return this.prismaService.answer.findUnique({
      where: {
        id,
      },
      include: {
        exam: true,
        answer: true,
      },
    });
  }
}
