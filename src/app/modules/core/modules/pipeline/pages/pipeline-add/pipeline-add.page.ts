import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, TemplateRef, EventEmitter, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { PipelineService } from '@services';
import { PipelineVM } from '@view-models';
import { DropResult } from 'ngx-smooth-dnd';

@Component({
  selector: 'app-pipeline-add',
  templateUrl: './pipeline-add.page.html',
  styleUrls: ['./pipeline-add.page.scss']
})
export class PipelineAddPage implements OnInit {
  @Output() useReload: EventEmitter<PipelineVM> = new EventEmitter<PipelineVM>();
  name = new FormControl('New Pipeline', [Validators.required]);
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
  constructor(
    protected readonly router: Router,
    protected readonly dialogService: NbDialogService,
    protected readonly pipelineService: PipelineService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnInit() {
  }
  useCreate = (ref: NbDialogRef<any>) => {
    if (this.name.valid && this.stages.valid) {
      this.pipelineService.save({
        name: this.name.value,
        stages: this.stages.value.map((e, i) => ({...e, position: i})),
      }).subscribe((data) => {
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
  useDialog<T>(template: TemplateRef<any>, index: T) {
    this.dialogService.open<T>(template, { context: index, closeOnBackdropClick: false });
  }
  useRemove = (index: number, ref: NbDialogRef<any>) => {
    this.stages.controls.splice(index, 1);
    ref.close();
  }
}
