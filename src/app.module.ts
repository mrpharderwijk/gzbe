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
import { SourcesController } from './sources/sources.controller';
import { SourceService } from './sources/source.service';
import { FeedService } from './feed/feed.service';
import { FeedsController } from './feed/feeds.controller';
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
    SourcesController,
    FeedsController,
  ],
  providers: [
    AuthService,
    AppService,
    ...databaseProviders,
    JwtStrategy,
    UserService,
    ...usersProviders,
    SourceService,
    FeedService,
  ],
  exports: [AuthService, ...databaseProviders, UserService, ...usersProviders],
})
export class AppModule {}
