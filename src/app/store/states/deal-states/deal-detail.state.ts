import { EntityState } from '@ngrx/entity';
import { DealDetailVM } from '@view-models';

export interface DealDetailState extends EntityState<DealDetailVM> {
  status: string;
  error: string;
}
