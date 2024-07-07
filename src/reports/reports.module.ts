import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './reports.entity';
@Module({

  providers: [ReportsService],
  controllers: [ReportsController],
  imports: [
    TypeOrmModule.forFeature([Report])
  ]
})
export class ReportsModule { }
