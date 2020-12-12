import { EntityState } from '@ngrx/entity';
import { GroupVM } from '@view-models';

export interface GroupState extends EntityState<GroupVM> {
  firstLoad: boolean;
}
