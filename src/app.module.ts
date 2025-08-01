import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { LocationsModule } from './locations/locations.module';
import { DomainModule } from './domain/domain.module';
import { CategoriesModule } from './categories/categories.module';
import { VendorsModule } from './vendors/vendors.module';
import { RolesModule } from './roles/roles.module';
import { TransactionModule } from './transaction/transaction.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AlertModule } from './alert/alert.module';
import { MaintenanceScheduleModule } from './maintenance-schedule/maintenance-schedule.module';
import { PurchaseHistoryModule } from './purchase-history/purchase-history.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      graphiql: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ItemsModule,
    LocationsModule,
    DomainModule,
    CategoriesModule,
    VendorsModule,
    RolesModule,
    TransactionModule,
    AlertModule,
    MaintenanceScheduleModule,
    PurchaseHistoryModule,
  ],
  providers: [AppService, AppResolver, PrismaService],
})
export class AppModule {}
