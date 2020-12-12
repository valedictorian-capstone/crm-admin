import { EntityState } from '@ngrx/entity';
import { CustomerVM } from '@view-models';

export interface CustomerState extends EntityState<CustomerVM> {
  firstLoad: boolean;
}
