import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, TemplateRef, EventEmitter, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { PipelineService } from '@services';
import { PipelineVM } from '@view-models';
import { DropResult } from 'ngx-smooth-dnd';
import { Subscription, of } from 'rxjs';
import swal from 'sweetalert2';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-pipeline-add',
  templateUrl: './pipeline-add.page.html',
  styleUrls: ['./pipeline-add.page.scss']
})
export class PipelineAddPage implements OnDestroy {
  @Output() useReload: EventEmitter<PipelineVM> = new EventEmitter<PipelineVM>();
  name = new FormControl('New Process', [Validators.required]);
  stages = new FormArray([
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
  ]);
  active = -1;
  dragging = false;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly router: Router,
    protected readonly dialogService: NbDialogService,
    protected readonly pipelineService: PipelineService,
    protected readonly toastrService: NbToastrService,
  ) { }
  useCreate = (ref: NbDialogRef<any>) => {
    if (this.name.valid && this.stages.valid) {
      if (this.stages.controls.length === 0) {
        swal.fire('Save process', 'Please add some stage to save process!', 'warning');
      } else {
        this.subscriptions.push(
          this.pipelineService.save({
            name: this.name.value,
            stages: this.stages.controls.map((e) => e.value).map((e, i) => ({ ...e, position: i })),
          })
            .pipe(
              tap((data) => {
                ref.close();
                this.toastrService.success('', 'Save process successful', { duration: 3000 });
                localStorage.setItem('selectedPipeline', data.id);
                this.router.navigate(['core/process']);
              }),
              catchError((err) => {
                this.toastrService.danger('', 'Save process fail! ' + err.message, { duration: 3000 });
                return of(undefined);
              })
            )
            .subscribe()
        );
      }
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
    this.router.navigate(['core/process']);
  }
  useDialog<T>(template: TemplateRef<any>, index: T) {
    this.dialogService.open<T>(template, { context: index, closeOnBackdropClick: false });
  }
  useRemove = (index: number, ref: NbDialogRef<any>) => {
    this.stages.removeAt(index);
    ref.close();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
