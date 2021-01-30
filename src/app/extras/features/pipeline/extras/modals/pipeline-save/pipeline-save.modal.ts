import { Component, OnInit, Output, Input, EventEmitter, TemplateRef } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { PipelineService, DealService, StageService } from '@services';
import { DealVM, PipelineVM, StageVM } from '@view-models';
import { Subscription, of } from 'rxjs';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { DropResult } from 'ngx-smooth-dnd';
import { PipelineAction } from '@store/actions';

interface IPipelineSavePageState {
  name: FormControl;
  stages: FormArray;
}
interface IPipelineSavePagePayload {
  pipeline: PipelineVM;
}
@Component({
  selector: 'app-pipeline-save',
  templateUrl: './pipeline-save.modal.html',
  styleUrls: ['./pipeline-save.modal.scss']
})
export class PipelineSaveModal implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() payload: IPipelineSavePagePayload = {
    pipeline: undefined,
  };
  subscriptions: Subscription[] = [];
  state: IPipelineSavePageState = {
    name: new FormControl('New Process', [Validators.required]),
    stages: new FormArray([])
  };

  constructor(
    protected readonly service: PipelineService,
    protected readonly dealService: DealService,
    protected readonly stageService: StageService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useInitForm();
  }

  ngOnInit() {
    if (this.payload.pipeline) {
      this.useSetData();
    }
  }

  useInitForm = () => {
    this.state.name = new FormControl('New Process', [Validators.required]);
    this.state.stages = new FormArray([
      new FormGroup({
        name: new FormControl('Qualified', [Validators.required]),
        probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      }),
      new FormGroup({
        name: new FormControl('Contact Made', [Validators.required]),
        probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      }),
      new FormGroup({
        name: new FormControl('Prospect Qualified', [Validators.required]),
        probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      }),
      new FormGroup({
        name: new FormControl('Needs Defined', [Validators.required]),
        probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      }),
      new FormGroup({
        name: new FormControl('Proposal Made', [Validators.required]),
        probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      }),
      new FormGroup({
        name: new FormControl('Negotiations Started', [Validators.required]),
        probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      }),
    ])
  }
  useSetData = () => {
    this.useShowSpinner();
    const subscription = this.service.findById(this.payload.pipeline.id)
      .pipe(
        tap((data) => {
          this.payload.pipeline = data;
          this.state.stages.clear();
          this.store.dispatch(PipelineAction.SaveSuccessAction({ res: data }));
          this.state.name.setValue(data.name);
          const stages = data.stages;
          for (let i = 0; i < stages.length; i++) {
            const stage = stages[i];
            this.state.stages.controls.push(new FormGroup({
              id: new FormControl(stage.id),
              deals: new FormControl(stage.deals),
              name: new FormControl(stage.name, [Validators.required]),
              probability: new FormControl(stage.probability, [Validators.required, Validators.min(0), Validators.max(100)]),
            }));
          }
          console.log(this.state);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe()
    this.subscriptions.push(subscription);
  }
  useSubmit = async (ref: NbDialogRef<any>) => {
    ref.close();
    if (this.state.name.valid && this.state.stages.valid) {
      this.useShowSpinner();
      const subscription = this.service.save({
        id: this.payload.pipeline?.id,
        name: this.state.name.value,
        stages: this.state.stages.controls.map((e) => e.value).map((e, i) => ({ id: e.id, name: e.name, position: i } as any)),
      })
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Save process successful!', { duration: 3000 });
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Save process fail! ' + err.error.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        ).subscribe()
      this.subscriptions.push(subscription);
    } else {
      this.state.name.markAsUntouched();
      this.state.stages.markAsTouched();
    }
  }
  useDrop = (dropResult: DropResult) => {
    if (dropResult.addedIndex !== null && dropResult.removedIndex !== null) {
      moveItemInArray(this.state.stages.controls, dropResult.removedIndex, dropResult.addedIndex);
    }
  }
  useAdd = () => {
    this.state.stages.controls.push(new FormGroup({
      name: new FormControl('New Stage', [Validators.required]),
      probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    }));
  }
  useDialog(template: TemplateRef<any>, index: number, stage?: StageVM) {
    if (stage) {
      if (stage.id) {
        this.dialogService.open(template, {
          context: {
            index,
            stage
          }, closeOnBackdropClick: false
        });
      } else {
        this.dialogService.open(template, { context: { index, stage: { ...stage, deals: [] } }, closeOnBackdropClick: false });
      }
    } else {
      this.dialogService.open(template, { context: { index }, closeOnBackdropClick: false });
    }
  }
  useRemove = (index: number, stage: StageVM, ref?: NbDialogRef<any>) => {
    ref.close();
    if (stage && this.payload.pipeline) {
      this.spinner.show('pipeline-save');
      this.subscriptions.push(
        this.stageService.remove(stage.id)
          .pipe(
            tap(() => {
              this.state.stages.controls.splice(index, 1);
              this.toastrService.success('', 'Remove stage successful', { duration: 3000 });
            }),
            catchError((err) => {
              this.toastrService.success('', 'Remove stage fail! ' + err.message, { duration: 3000 });
              return of(undefined);
            }),
            finalize(() => {
              this.spinner.hide('pipeline-save');
            }),
          )
          .subscribe()
      );
    } else {
      this.state.stages.controls.splice(index, 1);
    }
  }
  useMoveAndRemove = (index: number, ref: NbDialogRef<any>, deals: DealVM[], stage: StageVM, oldStage: StageVM) => {
    ref.close();
    this.spinner.show('pipeline-save');
    this.subscriptions.push(
      this.dealService.update(deals.map((e) => ({
        id: e.id,
        stage: { id: stage.id },
        activitys: undefined,
        notes: undefined,
        logs: undefined,
        dealDetails: undefined,
        attachments: undefined,
      } as any)) as any)
        .pipe(
          switchMap(() => this.stageService.remove(oldStage.id)),
          tap(() => {
            this.state.stages.controls.splice(index, 1);
            this.toastrService.success('', 'Remove stage successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.success('', 'Remove stage fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.spinner.hide('pipeline-save');
          })
        )
        .subscribe()
    );
  }
  useShowSpinner = () => {
    this.spinner.show('pipeline-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('pipeline-save');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
