import { EntityState } from '@ngrx/entity';
import { DeviceVM } from '@view-models';

export interface DeviceState extends EntityState<DeviceVM> {
  status: string;
  error: string;
}
