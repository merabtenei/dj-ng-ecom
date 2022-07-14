import { BaseRepresentation } from './base-representation';
import { Category } from './category';
import { Brand } from './brand';

export interface Product extends BaseRepresentation {
  id: number;
  slug: string;
  name: string;
  category: Category | number;
  brand: Brand | number;
  price: number;
  discount: number;
  image: string | null;
}
