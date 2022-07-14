import { BaseRepresentation } from './base-representation';

export interface Brand extends BaseRepresentation {
  name: string;
  ordering: number;
}
