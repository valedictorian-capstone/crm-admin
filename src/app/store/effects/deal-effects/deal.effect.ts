import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DealService } from '@services';
import { DealAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class DealEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: DealService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(deals => DealAction.useFindAllSuccessAction({ deals, status: action.status })),
          catchError(async (error) => DealAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealAction.useCreateAction),
      switchMap(action =>
        this.service.insert(action.deal).pipe(
          delay(1000),
          map(deal => DealAction.useCreateSuccessAction({ deal, status: action.status })),
          catchError(async (error) => DealAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealAction.useUpdateAction),
      switchMap(action =>
        this.service.update(action.deal).pipe(
          delay(1000),
          map(deal => DealAction.useUpdateSuccessAction({ deal, status: action.status })),
          catchError(async (error) => DealAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => DealAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => DealAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
