import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RoleService } from '@services';
import { RoleAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { RoleVM } from '@view-models';

@Injectable()
export class RoleEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: RoleService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleAction.SocketAction),
      tap(() => console.log('socket')),
      switchMap(action =>
        this.service.triggerSocket().pipe(
          tap((data) => console.log('test', data)),

          map(trigger => {
            console.log('effect-socket', trigger);
            if (trigger.type === 'create') {
              return RoleAction.SaveSuccessAction({ res: trigger.data as RoleVM });
            } else if (trigger.type === 'update') {
              return RoleAction.SaveSuccessAction({ res: trigger.data as RoleVM });
            } else if (trigger.type === 'remove') {
              return RoleAction.RemoveSuccessAction({ id: (trigger.data as RoleVM).id });
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
      ofType(RoleAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          tap((data) => console.log('test', data)),

          map(res => RoleAction.FindAllSuccessAction({ res })),
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
