import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'shifei',
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}