import { IsNotEmpty } from 'class-validator';

export class ExamAddDto {
  @IsNotEmpty({
    message: '考试名称不能为空',
  })
  name: string;
}
