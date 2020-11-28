import { EntityState } from '@ngrx/entity';
import { ProductVM } from '@view-models';

export interface ProductState extends EntityState<ProductVM> {
  status: string;
  error: string;
  unique: { label: string, value: string, exist: boolean };
}
