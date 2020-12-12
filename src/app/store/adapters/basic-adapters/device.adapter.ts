import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EntitySelectors } from '@ngrx/entity/src/models';
import { DeviceState } from '@states';
import { DeviceVM } from '@view-models';
export const deviceAdapter: EntityAdapter<DeviceVM> = createEntityAdapter<DeviceVM>();

export const deviceInitialState: DeviceState = deviceAdapter.getInitialState({
  ids: [],
  entities: undefined,
  firstLoad: false
});
