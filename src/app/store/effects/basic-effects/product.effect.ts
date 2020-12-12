import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from '@services';
import { ProductAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductVM } from '@view-models';

@Injectable()
export class ProductEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: ProductService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductAction.SocketAction),
      tap(() => console.log('socket')),
      switchMap(action =>
        this.service.triggerSocket().pipe(
          tap((data) => console.log('test', data)),

          map(trigger => {
            console.log('effect-socket', trigger);
            if (trigger.type === 'create') {
              return ProductAction.SaveSuccessAction({ res: trigger.data as ProductVM });
            } else if (trigger.type === 'update') {
              return ProductAction.SaveSuccessAction({ res: trigger.data as ProductVM });
            } else if (trigger.type === 'remove') {
              return ProductAction.RemoveSuccessAction({ id: (trigger.data as ProductVM).id });
            }
          }),
          catchError((error: Error) => {
            return of(undefined);
          }),
        )
      )
    )
  );
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          tap((data) => console.log('test', data)),

          map(res => ProductAction.FindAllSuccessAction({ res })),
          tap((data) => {
            if (action.success) {
              action.success(data.res)
            }
          }),
          catchError((error: Error) => {
            if (action.error) {
              action.error(error);
            }
            return of(undefined);
          }),
          finalize(() => {
            if (action.finalize) {
              action.finalize();
            }
          })
        )
      )
    )
  );
}
