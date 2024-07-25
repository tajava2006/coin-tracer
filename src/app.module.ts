import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { TestModule } from './domain/test/test.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'config/database/database.service';
import { TraceModule } from './domain/trace/trace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/environment/${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseService,
      name: 'default',
    }),
    TraceModule,
    // TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
