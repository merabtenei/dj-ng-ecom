import { BaseRepresentation } from './base-representation';

export interface Category extends BaseRepresentation {
  name: string;
  ordering: number;
  parent: any;
}
