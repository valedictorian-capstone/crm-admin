import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AttachmentService } from '@services';
import { AttachmentAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class AttachmentEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: AttachmentService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AttachmentAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(attachments => AttachmentAction.useFindAllSuccessAction({ attachments, status: action.status })),
          catchError(async (error) => AttachmentAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AttachmentAction.useCreateAction),
      switchMap(action =>
        this.service.insert(action.attachment).pipe(
          delay(1000),
          map(attachment => AttachmentAction.useCreateSuccessAction({ attachment, status: action.status })),
          catchError(async (error) => AttachmentAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AttachmentAction.useUpdateAction),
      switchMap(action =>
        this.service.update(action.attachment).pipe(
          delay(1000),
          map(attachment => AttachmentAction.useUpdateSuccessAction({ attachment, status: action.status })),
          catchError(async (error) => AttachmentAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AttachmentAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => AttachmentAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => AttachmentAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
