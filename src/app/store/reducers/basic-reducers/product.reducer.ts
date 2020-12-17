import { createReducer, on } from '@ngrx/store';
import { productAdapter, productInitialState } from '@adapters';
import { ProductAction } from '@actions';
import { ProductState } from '@states';
export const productFeatureKey = 'product';
export const productReducer = createReducer(
  productInitialState,
  on(ProductAction.FindAllSuccessAction,
    (state, action) => productAdapter.setAll<ProductState>(action.res, {
      ...state,
      firstLoad: true
    })
  ),
  on(ProductAction.SaveSuccessAction,
    (state, action) => productAdapter.upsertOne<ProductState>(action.res, {
      ...state,
    })
  ),
  on(ProductAction.RemoveSuccessAction,
    (state, action) => productAdapter.removeOne<ProductState>(action.id, {
      ...state,
    })
  ),
  on(ProductAction.ResetAction,
    () => productAdapter.setAll<ProductState>([], productInitialState)
  ),
);
