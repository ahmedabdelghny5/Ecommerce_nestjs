import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule, UserModule, ProductModule, CouponModule, CartModule, OrderModule } from './modules';
import { GlobalModule } from './global.module';
import { CoreModule } from './core/core.module';
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { GqlConfig } from './graphql/graphql.config.js';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './config/.env',
    }),
    CoreModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
    }),
    GqlConfig,
    MongooseModule.forRoot(process.env.DB_URL as string),
    GlobalModule,
    UserModule,
    CategoryModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
