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
        username: process.env.elasticUsername,
        password: process.env.elasticPassword,
      },
      tls: {
        rejectUnauthorized: false, //Allows self-signed certs
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, KafkaConsumerService],
})
export class AppModule {}
