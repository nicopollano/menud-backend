import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { PlanPrivateController } from './plan-private.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  controllers: [PlanController, PlanPrivateController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
