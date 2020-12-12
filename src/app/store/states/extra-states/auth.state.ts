import { EntityState } from '@ngrx/entity';
import { AccountVM } from '@view-models';

export interface AuthState extends EntityState<AccountVM> {
  profile: AccountVM | undefined;
}
