import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { DropResult } from 'ngx-smooth-dnd';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { DealService, PipelineService, StageService } from '@services';
import { DealVM, PipelineVM, StageVM } from '@view-models';
import { of } from 'rxjs';
import { switchMap, finalize, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pipeline-edit',
  templateUrl: './pipeline-edit.page.html',
  styleUrls: ['./pipeline-edit.page.scss']
})
export class PipelineEditPage implements OnInit {
  @Output() useReload: EventEmitter<PipelineVM> = new EventEmitter<PipelineVM>();
  name = new FormControl('Old Pipeline', [Validators.required]);
  stages = new FormArray([
    new FormGroup({
      id: new FormControl(undefined),
      name: new FormControl('Qualified', [Validators.required]),
      probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    }),
    new FormGroup({
      id: new FormControl(undefined),
      name: new FormControl('Contact Made', [Validators.required]),
      probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    }),
    new FormGroup({
      id: new FormControl(undefined),
      name: new FormControl('Prospect Qualified', [Validators.required]),
      probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    }),
    new FormGroup({
      id: new FormControl(undefined),
      name: new FormControl('Needs Defined', [Validators.required]),
      probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    }),
    new FormGroup({
      id: new FormControl(undefined),
      name: new FormControl('Proposal Made', [Validators.required]),
      probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    }),
    new FormGroup({
      id: new FormControl(undefined),
      name: new FormControl('Negotiations Started', [Validators.required]),
      probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    }),
  ]);
  active = -1;
  dragging = false;
  constructor(
    protected readonly router: Router,
    protected readonly dialogService: NbDialogService,
    protected readonly stageService: StageService,
    protected readonly dealService: DealService,
    protected readonly pipelineService: PipelineService,
    protected readonly toastrService: NbToastrService,
    protected readonly spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit() {
    this.spinner.show('edit-pipeline');
    this.pipelineService.findById(localStorage.getItem('selectedPipeline'))
      .pipe(
        finalize(() => {
          this.spinner.hide('edit-pipeline');
        })
      )
      .subscribe((data) => {
        this.name.setValue(data.name);
        this.stages.clear();
        data.stages.forEach((e) => this.stages.controls.push(new FormGroup({
          id: new FormControl(e.id),
          name: new FormControl(e.name, [Validators.required]),
          probability: new FormControl(e.probability, [Validators.required, Validators.min(0), Validators.max(100)]),
        })));
      });
  }
  useUpdate = (ref: NbDialogRef<any>) => {
    if (this.name.valid && this.stages.valid) {
      this.spinner.show('edit-pipeline');
      this.pipelineService.save({
        id: localStorage.getItem('selectedPipeline'),
        name: this.name.value,
        stages: this.stages.value.map((e, i) => ({ ...e, position: i, id: e.id != null ? e.id : undefined })),
      })
        .pipe(
          finalize(() => {
            this.spinner.hide('edit-pipeline');
          })
        )
        .subscribe((data) => {
          this.useReload.emit(data);
          ref.close();
          this.toastrService.success('', 'Success to save process');
          localStorage.setItem('selectedPipeline', data.id);
          this.router.navigate(['core/pipeline']);
        }, (err) => {
          this.toastrService.danger('', 'Fail to save process');
        });
    } else {
      this.name.markAsTouched();
      this.stages.markAsTouched();
    }
  }
  useDrop = (dropResult: DropResult) => {
    if (dropResult.addedIndex !== null && dropResult.removedIndex !== null) {
      moveItemInArray(this.stages.controls, dropResult.removedIndex, dropResult.addedIndex);
    }
  }
  usePlus = (index?: number) => {
    if (index) {
      this.stages.controls.splice(index, 0, new FormGroup({
        name: new FormControl('New Stage', [Validators.required]),
        probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      }));
    } else {
      this.stages.push(new FormGroup({
        name: new FormControl('New Stage', [Validators.required]),
        probability: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      }));
    }
  }
  useCancel = (ref: NbDialogRef<any>) => {
    ref.close();
    this.router.navigate(['core/pipeline']);
  }
  useDialog(template: TemplateRef<any>, index: number, stage?: StageVM) {
    if (stage) {
      this.stageService
        .findById(stage.id)
        .subscribe((data) => this.dialogService.open(template, {
          context: {
            index,
            stage: { ...stage, deals: data.deals.map((e) => ({ ...e, stage: data })) }
          }, closeOnBackdropClick: false
        }));
    } else {
      this.dialogService.open(template, { context: { index }, closeOnBackdropClick: false });
    }
  }
  useRemove = (index: number, ref: NbDialogRef<any>) => {
    this.stages.controls.splice(index, 1);
    ref.close();
  }
  useMoveAndRemove = (index: number, ref: NbDialogRef<any>, deals: DealVM[], stage: StageVM, oldStage: StageVM) => {
    this.spinner.show('edit-pipeline');
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
        finalize(() => {
          this.spinner.hide('edit-pipeline');
        })
      )
      .subscribe(() => {
        this.stages.controls.splice(index, 1);
        ref.close();
      });
  }
}
