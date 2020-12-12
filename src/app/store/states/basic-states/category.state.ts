import { EntityState } from '@ngrx/entity';
import { CategoryVM } from '@view-models';

export interface CategoryState extends EntityState<CategoryVM> {
  firstLoad: boolean;
}
