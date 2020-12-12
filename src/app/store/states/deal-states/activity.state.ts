import { EntityState } from '@ngrx/entity';
import { ActivityVM } from '@view-models';

export interface ActivityState extends EntityState<ActivityVM> {
  firstLoad: boolean;
}
