import { ProductAction } from '@actions';
import { productAdapter, productInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { ProductState } from '@states';
export const productFeatureKey = 'product';
export const productReducer = createReducer(
  productInitialState,
  on(ProductAction.useFindAllAction,
    (state, action) => productAdapter.setAll<ProductState>([], {
      ...state,
      status: action.status
    })
  ),
  on(ProductAction.useFindAllSuccessAction,
    (state, action) => productAdapter.setAll<ProductState>(action.products, {
      ...state,
      status: action.status
    })
  ),
  on(ProductAction.useUpdateAction,
    (state, action) => productAdapter.setOne<ProductState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(ProductAction.useUpdateSuccessAction,
    (state, action) => productAdapter.updateOne<ProductState>({
      id: action.product.id,
      changes: action.product
    }, state)
  ),
  on(ProductAction.useCreateAction,
    (state, action) => productAdapter.setOne<ProductState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(ProductAction.useCreateSuccessAction,
    (state, action) => productAdapter.addOne<ProductState>(action.product, state)
  ),
  on(ProductAction.useRemoveAction,
    (state, action) => productAdapter.setOne<ProductState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(ProductAction.useRemoveSuccessAction,
    (state, action) => productAdapter.removeOne<ProductState>(action.id, state)
  ),
  on(ProductAction.useResetAction,
    (state, action) => productAdapter.setAll<ProductState>(action.products, productInitialState)
  ),
  on(ProductAction.useUniqueAction,
    (state, action) => productAdapter.setOne<ProductState>(undefined, {
      ...state,
      status: action.status,
      unique: {
        label: action.data.label,
        value: action.data.value,
        exist: false,
      }
    }),
  ),
  on(ProductAction.useUniqueSuccessAction,
    (state, action) => productAdapter.setOne<ProductState>(undefined, {
      ...state,
      status: 'done',
      unique: {
        ...state.unique,
        exist: action.result,
      }
    })
  ),
  on(ProductAction.useErrorAction,
    (state, action) => productAdapter.setOne<ProductState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
