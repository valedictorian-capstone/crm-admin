import { EntityState } from '@ngrx/entity';
import { ProductVM } from '@view-models';

export interface ProductState extends EntityState<ProductVM> {
  firstLoad: boolean;
}
