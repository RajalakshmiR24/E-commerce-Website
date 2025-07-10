import { Product, Shop, Category } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Industrial Parts & Tools',
    icon: 'Wrench',
    subcategories: ['Hand Tools', 'Power Tools', 'Industrial Equipment']
  },
  {
    id: '2',
    name: 'Health & Beauty',
    icon: 'Heart',
    subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Wellness']
  },
  {
    id: '3',
    name: 'Gifts, Sports & Toys',
    icon: 'Gift',
    subcategories: ['Sports Equipment', 'Toys', 'Games', 'Gifts']
  },
  {
    id: '4',
    name: 'Fashion & Accessories',
    icon: 'Shirt',
    subcategories: ['Mens Fashion', 'Womens Fashion', 'Accessories', 'Jewelry']
  },
  {
    id: '5',
    name: 'Packaging & Office',
    icon: 'Package',
    subcategories: ['Office Supplies', 'Packaging Materials', 'Stationery']
  },
  {
    id: '6',
    name: 'Home & Garden',
    icon: 'Home',
    subcategories: ['Furniture', 'Decor', 'Garden', 'Kitchen']
  },
  {
    id: '7',
    name: 'Electronics',
    icon: 'Smartphone',
    subcategories: ['Smartphones', 'Laptops', 'Accessories', 'Gaming']
  }
];

export const shops: Shop[] = [
  {
    id: '1',
    name: 'Furniture Paradise',
    address: '123 Main Street, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@furnitureparadise.com',
    rating: 4.8,
    reviews: 1250,
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
    products: ['1', '2', '3', '4', '5']
  },
  {
    id: '2',
    name: 'Tech Central',
    address: '456 Tech Avenue, San Francisco, CA 94101',
    phone: '+1 (555) 987-6543',
    email: 'support@techcentral.com',
    rating: 4.6,
    reviews: 890,
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400',
    products: ['6', '7', '8']
  },
  {
    id: '3',
    name: 'Fashion Hub',
    address: '789 Fashion Street, Los Angeles, CA 90210',
    phone: '+1 (555) 456-7890',
    email: 'hello@fashionhub.com',
    rating: 4.7,
    reviews: 2100,
    image: 'https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=400',
    products: ['9', '10', '11', '12']
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Modern Office Chair',
    description: 'Ergonomic design with lumbar support, perfect for long working hours. Features adjustable height and armrests.',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Home & Garden',
    subcategory: 'Furniture',
    images: [
      'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    rating: 4.5,
    reviews: 128,
    inStock: true,
    stock: 15,
    features: ['Ergonomic Design', 'Adjustable Height', 'Lumbar Support', '360° Rotation'],
    shopId: '1',
    shopName: 'Furniture Paradise',
    discount: 25,
    tags: ['office', 'furniture', 'chair', 'ergonomic']
  },
  {
    id: '2',
    name: 'Pink Accent Chair',
    description: 'Stylish pink velvet accent chair that adds elegance to any room. Comfortable seating with modern design.',
    price: 449.99,
    originalPrice: 599.99,
    category: 'Home & Garden',
    subcategory: 'Furniture',
    images: [
      'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    rating: 4.7,
    reviews: 89,
    inStock: true,
    stock: 8,
    features: ['Velvet Upholstery', 'Comfortable Padding', 'Sturdy Frame', 'Easy Assembly'],
    shopId: '1',
    shopName: 'Furniture Paradise',
    discount: 25,
    tags: ['chair', 'accent', 'pink', 'velvet', 'modern']
  },
  {
    id: '3',
    name: 'Scandinavian Dining Table',
    description: 'Minimalist wooden dining table with clean lines. Perfect for modern homes with space for 6 people.',
    price: 799.99,
    originalPrice: 999.99,
    category: 'Home & Garden',
    subcategory: 'Furniture',
    images: [
      'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    rating: 4.8,
    reviews: 156,
    inStock: true,
    stock: 5,
    features: ['Solid Wood', 'Seats 6 People', 'Scratch Resistant', 'Easy Maintenance'],
    shopId: '1',
    shopName: 'Furniture Paradise',
    discount: 20,
    tags: ['dining', 'table', 'wooden', 'scandinavian', 'modern']
  },
  {
    id: '4',
    name: 'Luxury Sofa Set',
    description: 'Premium 3-seater sofa with matching cushions. High-quality fabric and comfortable foam padding.',
    price: 1299.99,
    originalPrice: 1599.99,
    category: 'Home & Garden',
    subcategory: 'Furniture',
    images: [
      'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    rating: 4.6,
    reviews: 203,
    inStock: true,
    stock: 12,
    features: ['3-Seater', 'Premium Fabric', 'Comfortable Padding', 'Matching Cushions'],
    shopId: '1',
    shopName: 'Furniture Paradise',
    discount: 19,
    tags: ['sofa', 'luxury', 'comfortable', 'living room']
  },
  {
    id: '5',
    name: 'Microfiber Towel Set',
    description: 'Ultra-soft microfiber towels with quick-dry technology. Perfect for kitchen and bathroom use.',
    price: 29.99,
    originalPrice: 39.99,
    category: 'Home & Garden',
    subcategory: 'Kitchen',
    images: [
      'https://images.pexels.com/photos/6985001/pexels-photo-6985001.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/6985003/pexels-photo-6985003.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    rating: 4.4,
    reviews: 45,
    inStock: true,
    stock: 50,
    features: ['Quick Dry', 'Ultra Soft', 'Lint Free', 'Machine Washable'],
    shopId: '1',
    shopName: 'Furniture Paradise',
    discount: 25,
    tags: ['towel', 'microfiber', 'kitchen', 'bathroom']
  },
  {
    id: '6',
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    originalPrice: 249.99,
    category: 'Electronics',
    subcategory: 'Accessories',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    rating: 4.7,
    reviews: 312,
    inStock: true,
    stock: 25,
    features: ['Noise Cancellation', '30-Hour Battery', 'Wireless', 'Premium Sound'],
    shopId: '2',
    shopName: 'Tech Central',
    discount: 20,
    tags: ['headphones', 'wireless', 'audio', 'tech']
  },
  {
    id: '7',
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking, GPS, and smartphone integration.',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Electronics',
    subcategory: 'Accessories',
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    rating: 4.5,
    reviews: 189,
    inStock: true,
    stock: 18,
    features: ['Health Tracking', 'GPS', 'Water Resistant', 'Long Battery Life'],
    shopId: '2',
    shopName: 'Tech Central',
    discount: 25,
    tags: ['smartwatch', 'fitness', 'tech', 'health']
  },
  {
    id: '8',
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand with cooling design. Compatible with all laptop sizes.',
    price: 59.99,
    originalPrice: 79.99,
    category: 'Electronics',
    subcategory: 'Accessories',
    images: [
      'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    rating: 4.3,
    reviews: 78,
    inStock: true,
    stock: 32,
    features: ['Adjustable Height', 'Cooling Design', 'Universal Fit', 'Portable'],
    shopId: '2',
    shopName: 'Tech Central',
    discount: 25,
    tags: ['laptop', 'stand', 'accessories', 'ergonomic']
  },
  {
    id: '9',
    name: 'Designer Handbag',
    description: 'Elegant leather handbag with multiple compartments. Perfect for everyday use and special occasions.',
    price: 159.99,
    originalPrice: 199.99,
    category: 'Fashion & Accessories',
    subcategory: 'Accessories',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1152078/pexels-photo-1152078.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    rating: 4.6,
    reviews: 134,
    inStock: true,
    stock: 15,
    features: ['Genuine Leather', 'Multiple Compartments', 'Adjustable Strap', 'Elegant Design'],
    shopId: '3',
    shopName: 'Fashion Hub',
    discount: 20,
    tags: ['handbag', 'leather', 'fashion', 'accessories']
  },
  {
    id: '10',
    name: 'Casual T-Shirt',
    description: 'Comfortable cotton t-shirt perfect for everyday wear. Available in multiple colors and sizes.',
    price: 24.99,
    originalPrice: 34.99,
    category: 'Fashion & Accessories',
    subcategory: 'Mens Fashion',
    images: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    rating: 4.2,
    reviews: 67,
    inStock: true,
    stock: 45,
    features: ['100% Cotton', 'Comfortable Fit', 'Multiple Colors', 'Machine Washable'],
    shopId: '3',
    shopName: 'Fashion Hub',
    discount: 29,
    tags: ['t-shirt', 'casual', 'cotton', 'fashion']
  },
  {
    id: '11',
    name: 'Summer Dress',
    description: 'Flowy summer dress with floral pattern. Light and comfortable for warm weather.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Fashion & Accessories',
    subcategory: 'Womens Fashion',
    images: [
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1536620/pexels-photo-1536620.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    rating: 4.8,
    reviews: 156,
    inStock: true,
    stock: 22,
    features: ['Floral Pattern', 'Lightweight Fabric', 'Comfortable Fit', 'Summer Ready'],
    shopId: '3',
    shopName: 'Fashion Hub',
    discount: 20,
    tags: ['dress', 'summer', 'floral', 'fashion']
  },
  {
    id: '12',
    name: 'Sneakers',
    description: 'Comfortable running sneakers with breathable mesh upper and cushioned sole.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'Fashion & Accessories',
    subcategory: 'Shoes',
    images: [
      'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1240893/pexels-photo-1240893.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    rating: 4.4,
    reviews: 89,
    inStock: true,
    stock: 35,
    features: ['Breathable Mesh', 'Cushioned Sole', 'Lightweight', 'Durable'],
    shopId: '3',
    shopName: 'Fashion Hub',
    discount: 25,
    tags: ['sneakers', 'running', 'comfortable', 'shoes']
  }
];

export const testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing shopping experience! Fast delivery and excellent customer service.',
    avatar: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Mike Chen',
    rating: 5,
    comment: 'Great quality products at competitive prices. Highly recommend!',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Emily Davis',
    rating: 4,
    comment: 'Love the variety of products available. Easy to navigate and find what I need.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];