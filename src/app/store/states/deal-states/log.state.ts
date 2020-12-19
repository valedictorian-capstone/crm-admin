import { EntityState } from '@ngrx/entity';
import { LogVM } from '@view-models';

export interface LogState extends EntityState<LogVM> {
  firstLoad: boolean;
}
