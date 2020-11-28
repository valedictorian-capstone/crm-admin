import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DealDetailService } from '@services';
import { DealDetailAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class DealDetailEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: DealDetailService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealDetailAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(dealDetails => DealDetailAction.useFindAllSuccessAction({ dealDetails, status: action.status })),
          catchError(async (error) => DealDetailAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealDetailAction.useCreateAction),
      switchMap(action =>
        this.service.insert(action.dealDetail).pipe(
          delay(1000),
          map(dealDetail => DealDetailAction.useCreateSuccessAction({ dealDetail, status: action.status })),
          catchError(async (error) => DealDetailAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealDetailAction.useUpdateAction),
      switchMap(action =>
        this.service.update(action.dealDetail).pipe(
          delay(1000),
          map(dealDetail => DealDetailAction.useUpdateSuccessAction({ dealDetail, status: action.status })),
          catchError(async (error) => DealDetailAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealDetailAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => DealDetailAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => DealDetailAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
