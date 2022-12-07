import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracesModule } from './traces/traces.module';
import { GeolocationModule } from './geolocation/geolocation.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      database: process.env.DATABASE_DATABASE,
      synchronize: process.env.DATABASE_SYNC === 'true',
      autoLoadEntities: true,
    }),
    TracesModule,
    GeolocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
