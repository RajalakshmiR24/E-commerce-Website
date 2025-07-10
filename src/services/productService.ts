import { api, endpoints } from './api';
import { Product } from '../types';

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
  tags?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  products: Product[];
}

export interface ProductReviewRequest {
  rating: number;
  comment: string;
  images?: string[];
}

class ProductService {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>(endpoints.products.list, filters);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch products');
  }

  async getProductById(id: string): Promise<Product> {
    const response = await api.get<{ product: Product }>(endpoints.products.detail(id));
    
    if (response.success && response.data) {
      return response.data.product;
    }
    
    throw new Error(response.message || 'Failed to fetch product');
  }

  async getCategories(): Promise<{ categories: string[]; subcategories: any[] }> {
    const response = await api.get<{ categories: string[]; subcategories: any[] }>(
      endpoints.products.categories
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch categories');
  }

  async getBrands(): Promise<{ brands: string[] }> {
    const response = await api.get<{ brands: string[] }>(endpoints.products.brands);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch brands');
  }

  async addProductReview(productId: string, review: ProductReviewRequest): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      endpoints.products.reviews(productId),
      review
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to add review');
  }
}

export const productService = new ProductService();