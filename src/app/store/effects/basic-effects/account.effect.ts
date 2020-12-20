import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AccountService } from '@services';
import { AccountAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountVM } from '@view-models';

@Injectable()
export class AccountEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: AccountService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountAction.SocketAction),
      switchMap(action =>
        this.service.triggerSocket().pipe(
          map(trigger => {
            if (trigger.type === 'create') {
              return AccountAction.SaveSuccessAction({ res: trigger.data as AccountVM });
            } else if (trigger.type === 'update') {
              return AccountAction.SaveSuccessAction({ res: trigger.data as AccountVM });
            } else if (trigger.type === 'remove') {
              return AccountAction.RemoveSuccessAction({ id: (trigger.data as AccountVM).id });
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
      ofType(AccountAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          map(res => AccountAction.FindAllSuccessAction({ res })),
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
