import { EntityState } from '@ngrx/entity';
import { RoleVM } from '@view-models';

export interface RoleState extends EntityState<RoleVM> {
  firstLoad: boolean;
}
