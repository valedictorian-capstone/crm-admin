import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EntitySelectors } from '@ngrx/entity/src/models';
import { CustomerState } from '@states';
import { CustomerVM } from '@view-models';
export const customerAdapter: EntityAdapter<CustomerVM> = createEntityAdapter<CustomerVM>();

export const customerInitialState: CustomerState = customerAdapter.getInitialState({
  ids: [],
  entities: undefined,
  firstLoad: false
});
