import { EntityState } from '@ngrx/entity';
import { DealVM } from '@view-models';

export interface DealState extends EntityState<DealVM> {
  firstLoad: boolean;
}
