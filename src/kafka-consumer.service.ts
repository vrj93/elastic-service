import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    private readonly configService: ConfigService,
    private readonly elasticsearchService: AppService,
  ) {}

  async onModuleInit() {
    this.kafka = new Kafka({
      clientId: 'elastic-service',
      brokers: [this.configService.get<string>('kafkaConnect')],
    });
    this.consumer = this.kafka.consumer({ groupId: 'product-group' });
    await this.connectConsumer();
  }

  async connectConsumer() {
    await this.consumer.connect();
    // Subscribe to all required topics
    const topics = ['product', 'brand', 'category', 'color'];
    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning: true });
    }

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        let parsed;
        try {
          parsed = JSON.parse(message.value.toString());
        } catch (e) {
          console.error('Invalid message format:', message.value.toString());
          return;
        }
        const { operationType, documentKey, fullDocument } = parsed;

        try {
          switch (topic) {
            case 'product':
              if (operationType === 'insert' || operationType === 'update') {
                await this.elasticsearchService.indexProduct(fullDocument);
              } else if (operationType === 'delete') {
                await this.elasticsearchService.deleteProduct(documentKey._id);
              }
              break;
            case 'brand':
              if (operationType === 'insert' || operationType === 'update') {
                await this.elasticsearchService.indexBrand(fullDocument);
              } else if (operationType === 'delete') {
                await this.elasticsearchService.deleteBrand(documentKey._id);
              }
              break;
            case 'category':
              if (operationType === 'insert' || operationType === 'update') {
                await this.elasticsearchService.indexCategory(fullDocument);
              } else if (operationType === 'delete') {
                await this.elasticsearchService.deleteCategory(documentKey._id);
              }
              break;
            case 'color':
              if (operationType === 'insert' || operationType === 'update') {
                await this.elasticsearchService.indexColor(fullDocument);
              } else if (operationType === 'delete') {
                await this.elasticsearchService.deleteColor(documentKey._id);
              }
              break;
            default:
              console.warn(`Unhandled topic: ${topic}`);
          }
        } catch (error) {
          console.error(`Failed to process message for topic ${topic}:`, error);
        }
      },
    });
    console.log(
      'Kafka Consumer connected and listening to topics: product, brand, category, color',
    );
  }

  async disconnectConsumer() {
    await this.consumer.disconnect();
  }
}
