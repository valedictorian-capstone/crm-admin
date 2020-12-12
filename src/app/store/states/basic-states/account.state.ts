import { EntityState } from '@ngrx/entity';
import { AccountVM } from '@view-models';

export interface AccountState extends EntityState<AccountVM> {
  firstLoad: boolean;
}
