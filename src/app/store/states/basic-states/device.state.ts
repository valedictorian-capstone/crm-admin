import { EntityState } from '@ngrx/entity';
import { DeviceVM } from '@view-models';

export interface DeviceState extends EntityState<DeviceVM> {
  firstLoad: boolean;
}
