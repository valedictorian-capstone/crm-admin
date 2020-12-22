import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DealDetailService } from '@services';
import { DealDetailAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { DealDetailVM } from '@view-models';

@Injectable()
export class DealDetailEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: DealDetailService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealDetailAction.SocketAction),

      switchMap(action =>
        this.service.triggerSocket().pipe(
          map(trigger => {

            if (trigger.type === 'create') {
              return DealDetailAction.SaveSuccessAction({ res: trigger.data as DealDetailVM });
            } else if (trigger.type === 'update') {
              return DealDetailAction.SaveSuccessAction({ res: trigger.data as DealDetailVM });
            } else if (trigger.type === 'remove') {
              return DealDetailAction.RemoveSuccessAction({ id: (trigger.data as DealDetailVM).id });
            }
            return DealDetailAction.ListAction({ res: [] });
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
      ofType(DealDetailAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          map(res => DealDetailAction.FindAllSuccessAction({ res })),
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
