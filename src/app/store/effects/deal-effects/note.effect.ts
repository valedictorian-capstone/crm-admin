import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NoteService } from '@services';
import { NoteAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class NoteEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: NoteService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NoteAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(notes => NoteAction.useFindAllSuccessAction({ notes, status: action.status })),
          catchError(async (error) => NoteAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NoteAction.useCreateAction),
      switchMap(action =>
        this.service.insert(action.note).pipe(
          delay(1000),
          map(note => NoteAction.useCreateSuccessAction({ note, status: action.status })),
          catchError(async (error) => NoteAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NoteAction.useUpdateAction),
      switchMap(action =>
        this.service.update(action.note).pipe(
          delay(1000),
          map(note => NoteAction.useUpdateSuccessAction({ note, status: action.status })),
          catchError(async (error) => NoteAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NoteAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => NoteAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => NoteAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
