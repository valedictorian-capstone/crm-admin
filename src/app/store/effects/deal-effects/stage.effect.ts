import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StageService } from '@services';
import { StageAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class StageEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: StageService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StageAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(stages => StageAction.useFindAllSuccessAction({ stages, status: action.status })),
          catchError(async (error) => StageAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StageAction.useCreateAction),
      switchMap(action =>
        this.service.insert(action.stage).pipe(
          delay(1000),
          map(stage => StageAction.useCreateSuccessAction({ stage, status: action.status })),
          catchError(async (error) => StageAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StageAction.useUpdateAction),
      switchMap(action =>
        this.service.update(action.stage).pipe(
          delay(1000),
          map(stage => StageAction.useUpdateSuccessAction({ stage, status: action.status })),
          catchError(async (error) => StageAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StageAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => StageAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => StageAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
