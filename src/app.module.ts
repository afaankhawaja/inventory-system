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
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      graphiql: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ItemsModule,
    LocationsModule,
    DomainModule,
    CategoriesModule,
  ],
  providers: [AppService, AppResolver, PrismaService],
})
export class AppModule {}
