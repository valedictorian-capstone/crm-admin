import { EntityState } from '@ngrx/entity';
import { AccountVM } from '@view-models';

export interface AccountState extends EntityState<AccountVM> {
  status: string;
  error: string;
  unique: { label: string, value: string, exist: boolean };
}
