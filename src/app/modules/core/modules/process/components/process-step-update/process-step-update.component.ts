import { Component, OnInit, TemplateRef, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { environment } from '@environments/environment';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroupService, ProcessStepService } from '@services';
import { DepartmentVM, FormGroupVM, ProcessConnectionVM, ProcessStepVM, ProcessVM } from '@view-models';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-process-step-update',
  templateUrl: './process-step-update.component.html',
  styleUrls: ['./process-step-update.component.scss']
})
export class ProcessStepUpdateComponent implements OnInit {
  @Input() departments: DepartmentVM[] = [];
  @Input() process: ProcessVM;
  @Input() step: ProcessStepVM;
  @Output() useDone: EventEmitter<ProcessStepVM> = new EventEmitter<ProcessStepVM>();
  form: FormGroup;
  visible = false;
  types = environment.types;
  subTypes = [];
  model: ProcessVM;
  filterSteps: ProcessStepVM[] = [];
  formGroups: (FormGroupVM & { isSelected?: boolean, isSee?: boolean })[] = [];
  load = false;
  icons = [
    {
      name: 'activity-task',
      value: 'bpmn-icon-call-activity'
    },
    {
      name: 'gateway-parallel',
      value: 'bpmn-icon-gateway-parallel'
    },
    {
      name: 'gateway-exclusive',
      value: 'bpmn-icon-gateway-xor'
    },
    {
      name: 'gateway-inclusive',
      value: 'bpmn-icon-gateway-or'
    },
    {
      name: 'event-start',
      value: 'bpmn-icon-start-event-none'
    },
    {
      name: 'event-end',
      value: 'bpmn-icon-end-event-none'
    },
  ];
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: ProcessStepService,
    protected readonly formService: FormGroupService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      type: [undefined, [Validators.required]],
      subType: [undefined, [Validators.required]],
      department: [undefined, [Validators.required]],
      description: '',
      processToConnections: fb.array([]),
    });
  }

  ngOnInit() {
    this.formService.findAll().subscribe((data) => this.formGroups = data);
    this.form.get('type').valueChanges.subscribe((data) => {
      this.subTypes = this.types.find((e) => e.name === data) ? this.types.find((e) => e.name === data).subTypes : [];
    });
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { dialogClass: 'update-modal' });
    this.load = true;
    this.service.findById(this.step.id).subscribe((data) => {
      this.step = data;
      this.form.reset({
        name: this.step.name, description: this.step.description, type: this.step.type, subType: this.step.subType,
        department: this.step.department?.id
      });
      this.formGroups = this.formGroups.map((formGroup) => this.step.formGroups.find((e) => e.id === formGroup.id)
        ? ({ ...formGroup, isSelected: true }) : formGroup);
      (this.form.get('processToConnections') as FormArray).clear();
      console.log(this.step);
      for (const connection of this.step.processToConnections) {
        (this.form.get('processToConnections') as FormArray).push(this.fb.group({
          ...connection,
          fromProcessStep: this.step,
        }));
      }
      this.filterSteps = this.process.processSteps.filter((step) => step.id !== this.step.id
        && (this.form.get('processToConnections').value as ProcessConnectionVM[])
          .map((e) => e.toProcessStep).findIndex((e) => e.id === step.id) === -1
        && this.step.processFromConnections.map((e) => e.fromProcessStep).findIndex((e) => e.id === step.id) === -1);
      this.load = false;
    });
  }
  submit = (ref: NbDialogRef<any>) => {
    if (this.form.valid) {
      this.load = true;
      this.service.update({
        ...this.step, ...this.form.value, department: { id: this.form.value.department },
        formGroups: this.formGroups.filter((formGroup) => formGroup.isSelected)
      }).pipe(finalize(() => { this.load = false; })).subscribe(
        (data) => {
          ref.close();
          swal.fire('Notification', 'Update new process-step successfully!!', 'success');
          this.useDone.emit(data);
        },
        (error) => {
          swal.fire('Notification', 'Something wrong on runtime! Please check again', 'error');
        }
      );
    } else {
      this.form.markAsTouched();
    }
    // ref.close();
  }
  addConnection = (processStep: ProcessStepVM) => {
    (this.form.get('processToConnections') as FormArray).push(this.fb.group({
      id: this.uuidv4(),
      type: '',
      description: '',
      fromProcessStep: this.step,
      toProcessStep: processStep,
    }));
    this.filterSteps = this.process.processSteps.filter((step) => step.id !== this.step.id
      && this.form.get('processToConnections').value.map((e) => e.toProcessStep).findIndex((e) => e.id === step.id) === -1
      && this.step.processFromConnections.map((e) => e.fromProcessStep).findIndex((e) => e.id === step.id) === -1);
    this.model = undefined;
  }
  removeConnection = (index: number) => {
    (this.form.get('processToConnections') as FormArray).removeAt(index);
    this.filterSteps = this.process.processSteps.filter((step) => step.id !== this.step.id
      && this.form.get('processToConnections').value.map((e) => e.toProcessStep).findIndex((e) => e.id === step.id) === -1
      && this.step.processFromConnections.map((e) => e.fromProcessStep).findIndex((e) => e.id === step.id) === -1);
  }
  checkCanSelect = () => {
    switch (this.step.type) {
      case 'activity':
        return this.form.get('processToConnections').value.length === 0;
      case 'gateway':
        return true;
      case 'event':
        return this.form.get('processToConnections').value.length === 0;
      default: return false;
    }
  }
  useToggle = (index: number, data: boolean) => {
    this.formGroups[index].isSelected = data;
  }
  useSee = (index: number, ref: HTMLElement) => {
    this.formGroups[index].isSee = this.formGroups[index].isSee ? false : true;
    setTimeout(() => {
      if (this.formGroups[index].isSee) {
        ref.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }, 100);
  }
  getIcon = (data: string) => {
    return this.icons.find((icon) => icon.name === data);
  }
  uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line: no-bitwise
      const r = Math.random() * 16 | 0;
      // tslint:disable-next-line: no-bitwise
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
