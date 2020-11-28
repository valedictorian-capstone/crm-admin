import { EntityState } from '@ngrx/entity';
import { CustomerVM } from '@view-models';

export interface CustomerState extends EntityState<CustomerVM> {
  status: string;
  error: string;
  unique: { label: string, value: string, exist: boolean };
}
