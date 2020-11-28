import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from '@services';
import { ProductAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class ProductEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: ProductService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(products => ProductAction.useFindAllSuccessAction({ products, status: action.status })),
          catchError(async (error) => ProductAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductAction.useCreateAction),
      switchMap(action =>
        this.service.insert(action.product).pipe(
          delay(1000),
          map(product => ProductAction.useCreateSuccessAction({ product, status: action.status })),
          catchError(async (error) => ProductAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductAction.useUpdateAction),
      switchMap(action =>
        this.service.update(action.product).pipe(
          delay(1000),
          map(product => ProductAction.useUpdateSuccessAction({ product, status: action.status })),
          catchError(async (error) => ProductAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => ProductAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => ProductAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly unique$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductAction.useUniqueAction),
      switchMap(action =>
        this.service.checkUnique(action.data.label, action.data.value).pipe(
          delay(1000),
          map(result => ProductAction.useUniqueSuccessAction({ result, status: action.status })),
          catchError(async (error) => ProductAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
