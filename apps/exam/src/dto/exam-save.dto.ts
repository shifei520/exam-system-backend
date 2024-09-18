import { IsNotEmpty, IsString } from 'class-validator';

export class ExamSaveDto {
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: number;
  @IsString()
  content: string;
}
