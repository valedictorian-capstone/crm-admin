import { EntityState } from '@ngrx/entity';
import { EventVM } from '@view-models';

export interface EventState extends EntityState<EventVM> {
  firstLoad: boolean;
}
