import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { databaseProviders } from './shared/database/database.providers';
import { usersProviders } from './users/users.providers';
import { UserService } from './users/user.service';
import { UsersController } from './users/users.controller';
import { DatabaseModule } from './shared/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';
import { NewsController } from './news/news.controller';
import { NewsService } from './news/news.service';
import { EmergenciesController } from './emergencies/emergencies.controller';
import { EmergenciesService } from './emergencies/emergencies.service';
import { TechController } from './tech/tech.controller';
import { TechService } from './tech/tech.service';
import { TrafficController } from './traffic/traffic.controller';
import { TrafficService } from './traffic/traffic.service';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.load(
      path.resolve(__dirname, 'shared/config/**/!(*.d).{ts,js}'),
    ),
    DatabaseModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('jwt').secretKey,
        signOptions: {
          expiresIn: Number(configService.get('jwt').expiresIn),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        defaultStrategy: configService.get('jwt').defaultStrategy,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    NewsController,
    EmergenciesController,
    TechController,
    TrafficController,
  ],
  providers: [
    AuthService,
    AppService,
    ...databaseProviders,
    JwtStrategy,
    UserService,
    ...usersProviders,
    NewsService,
    EmergenciesService,
    TechService,
    TrafficService,
  ],
  exports: [AuthService, ...databaseProviders, UserService, ...usersProviders],
})
export class AppModule {}
