import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ProductState } from '@states';
import { ProductVM } from '@view-models';
export const productAdapter: EntityAdapter<ProductVM> = createEntityAdapter<ProductVM>();

export const productInitialState: ProductState = productAdapter.getInitialState({
  ids: [],
  entities: undefined,
  firstLoad: false
});
