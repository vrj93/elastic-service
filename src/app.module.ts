import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { KafkaConsumerService } from './kafka-consumer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: configService.get<string>('elasticConnect'),
        auth: {
          username: configService.get<string>('elasticUsername'),
          password: configService.get<string>('elasticPassword'),
        },
        tls: {
          rejectUnauthorized: false, // Allows self-signed certs
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, KafkaConsumerService],
})
export class AppModule {}
