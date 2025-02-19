import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { KafkaConsumerService } from './kafka-consumer.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.elasticConnect,
      auth: {
        username: process.env.elasticUser,
        password: process.env.elasticPassword,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, KafkaConsumerService],
})
export class AppModule {}
