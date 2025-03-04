import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class AppService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexProduct(document: any) {
    await this.elasticsearchService.index({
      index: 'products',
      id: document._id,
      body: {
        name: document.name,
        description: document.description,
        category: document.category,
        brand: document.brand,
        color: document.specifications.color,
        price: document.price.amount,
      },
    });
  }

  async deleteProduct(id: string) {
    await this.elasticsearchService.delete({
      index: 'products',
      id,
    });
  }
}
