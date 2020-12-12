import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CustomerService } from '@services';
import { CustomerAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomerVM } from '@view-models';

@Injectable()
export class CustomerEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: CustomerService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAction.SocketAction),
      tap(() => console.log('socket')),
      switchMap(action =>
        this.service.triggerSocket().pipe(
          tap((data) => console.log('test', data)),

          map(trigger => {
            console.log('effect-socket', trigger);
            if (trigger.type === 'create') {
              return CustomerAction.SaveSuccessAction({ res: trigger.data as CustomerVM });
            } else if (trigger.type === 'update') {
              return CustomerAction.SaveSuccessAction({ res: trigger.data as CustomerVM });
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
      ofType(CustomerAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(

          map(res => CustomerAction.FindAllSuccessAction({ res })),
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
          }),
        )
      )
    )
  );
}
