import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActivityService } from '@services';
import { ActivityAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class ActivityEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: ActivityService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(activitys => ActivityAction.useFindAllSuccessAction({ activitys, status: action.status })),
          catchError(async (error) => ActivityAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityAction.useCreateAction),
      switchMap(action =>
        this.service.insert(action.activity).pipe(
          delay(1000),
          map(activity => ActivityAction.useCreateSuccessAction({ activity, status: action.status })),
          catchError(async (error) => ActivityAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityAction.useUpdateAction),
      switchMap(action =>
        this.service.update(action.activity).pipe(
          delay(1000),
          map(activity => ActivityAction.useUpdateSuccessAction({ activity, status: action.status })),
          catchError(async (error) => ActivityAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActivityAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => ActivityAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => ActivityAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
