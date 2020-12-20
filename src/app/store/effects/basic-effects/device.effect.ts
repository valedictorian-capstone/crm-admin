import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DeviceService } from '@services';
import { DeviceAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { DeviceVM } from '@view-models';

@Injectable()
export class DeviceEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: DeviceService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceAction.SocketAction),
      switchMap(action =>
        this.service.triggerSocket().pipe(
          map(trigger => {
            if (trigger.type === 'create') {
              return DeviceAction.SaveSuccessAction({ res: trigger.data as DeviceVM });
            } else if (trigger.type === 'update') {
              return DeviceAction.SaveSuccessAction({ res: trigger.data as DeviceVM });
            } else if (trigger.type === 'remove') {
              return DeviceAction.RemoveSuccessAction({ id: (trigger.data as DeviceVM).id });
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
      ofType(DeviceAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          map(res => DeviceAction.FindAllSuccessAction({ res })),
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
