import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersDataLoader } from './users.dataloader';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [PrismaService, UsersResolver, UsersService, UsersDataLoader],
})
export class UsersModule {}
