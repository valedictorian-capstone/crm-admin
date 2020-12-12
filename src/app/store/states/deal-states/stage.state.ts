import { EntityState } from '@ngrx/entity';
import { StageVM } from '@view-models';

export interface StageState extends EntityState<StageVM> {
  firstLoad: boolean;
}
