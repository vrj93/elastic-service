import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class AppService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexProduct(document: any) {
    try {
      await this.elasticsearchService.index({
        index: 'products',
        id: document._id,
        document: {
          name: document.name,
          description: document.description,
          category: document.category,
          brand: document.brand,
          color: document.specifications?.color,
          price: document.price?.amount ?? 0,
        },
      });
    } catch (error) {
      console.error(
        `Failed to index product ${document._id}:`,
        error.meta?.body?.error || error,
      );
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.elasticsearchService.delete({
        index: 'products',
        id,
      });
    } catch (error) {
      if (error.meta?.statusCode !== 404) {
        console.error(
          `Failed to delete product ${id}:`,
          error.meta?.body?.error || error,
        );
      }
    }
  }

  async indexBrand(document: any) {
    try {
      await this.elasticsearchService.index({
        index: 'brands',
        id: document._id,
        document: {
          name: document.name,
          description: document.description,
        },
      });
    } catch (error) {
      console.error(
        `Failed to index brand ${document._id}:`,
        error.meta?.body?.error || error,
      );
    }
  }

  async deleteBrand(id: string) {
    try {
      await this.elasticsearchService.delete({
        index: 'brands',
        id,
      });
    } catch (error) {
      if (error.meta?.statusCode !== 404) {
        console.error(
          `Failed to delete brand ${id}:`,
          error.meta?.body?.error || error,
        );
      }
    }
  }

  async indexCategory(document: any) {
    try {
      await this.elasticsearchService.index({
        index: 'categories',
        id: document._id,
        document: {
          name: document.name,
          description: document.description,
        },
      });
    } catch (error) {
      console.error(
        `Failed to index category ${document._id}:`,
        error.meta?.body?.error || error,
      );
    }
  }

  async deleteCategory(id: string) {
    try {
      await this.elasticsearchService.delete({
        index: 'categories',
        id,
      });
    } catch (error) {
      if (error.meta?.statusCode !== 404) {
        console.error(
          `Failed to delete category ${id}:`,
          error.meta?.body?.error || error,
        );
      }
    }
  }

  async indexColor(document: any) {
    try {
      await this.elasticsearchService.index({
        index: 'colors',
        id: document._id,
        document: {
          name: document.name,
          hex: document.hex,
        },
      });
    } catch (error) {
      console.error(
        `Failed to index color ${document._id}:`,
        error.meta?.body?.error || error,
      );
    }
  }

  async deleteColor(id: string) {
    try {
      await this.elasticsearchService.delete({
        index: 'colors',
        id,
      });
    } catch (error) {
      if (error.meta?.statusCode !== 404) {
        console.error(
          `Failed to delete color ${id}:`,
          error.meta?.body?.error || error,
        );
      }
    }
  }
}
