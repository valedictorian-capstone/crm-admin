import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DealService } from '@services';
import { DealAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { DealVM } from '@view-models';

@Injectable()
export class DealEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: DealService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealAction.SocketAction),

      switchMap(action =>
        this.service.triggerSocket().pipe(
          map(trigger => {

            if (trigger.type === 'create') {
              return DealAction.SaveSuccessAction({ res: trigger.data as DealVM });
            } else if (trigger.type === 'update') {
              return DealAction.SaveSuccessAction({ res: trigger.data as DealVM });
            } else if (trigger.type === 'remove') {
              return DealAction.RemoveSuccessAction({ id: (trigger.data as DealVM).id });
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
      ofType(DealAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          map(res => DealAction.FindAllSuccessAction({ res })),
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
