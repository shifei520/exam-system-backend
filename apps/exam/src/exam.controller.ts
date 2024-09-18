import { MessagePattern } from '@nestjs/microservices';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamAddDto } from './dto/exam-add.dto';
import { RequireLogin, UserInfo } from '@app/common';
import { ExamSaveDto } from './dto/exam-save.dto';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post('add')
  @RequireLogin()
  async add(
    @Body() examAddDto: ExamAddDto,
    @UserInfo('userId') userId: number,
  ) {
    return this.examService.add(examAddDto, userId);
  }

  @Get('list')
  @RequireLogin()
  async list(@UserInfo('userId') userId: number, @Query('bin') bin: string) {
    return this.examService.list(userId, bin);
  }

  @Delete('delete/:id')
  @RequireLogin()
  async delete(@UserInfo('userId') userId: number, @Param('id') id: number) {
    return this.examService.delete(userId, id);
  }

  @Post('save')
  @RequireLogin()
  async save(@Body() examSaveDto: ExamSaveDto) {
    return this.examService.save(examSaveDto);
  }

  @Get('publish/:id')
  @RequireLogin()
  async publish(@UserInfo('userId') userId: number, @Param('id') id: number) {
    return this.examService.publish(userId, id);
  }

  @Get('unpublish/:id')
  @RequireLogin()
  async unpublish(@UserInfo('userId') userId: number, @Param('id') id: number) {
    return this.examService.unpublish(userId, id);
  }

  @Get('find/:id')
  @RequireLogin()
  async find(@Param('id') id: number) {
    return this.examService.find(id);
  }
}
