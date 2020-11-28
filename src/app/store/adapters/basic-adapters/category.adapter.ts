import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EntitySelectors } from '@ngrx/entity/src/models';
import { CategoryState } from '@states';
import { CategoryVM } from '@view-models';
export const categoryAdapter: EntityAdapter<CategoryVM> = createEntityAdapter<CategoryVM>();

export const categoryInitialState: CategoryState = categoryAdapter.getInitialState({
  error: undefined,
  status: '',
  ids: [],
  entities: undefined,
});
