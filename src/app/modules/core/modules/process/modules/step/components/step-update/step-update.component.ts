import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { FormGroupService, ProcessStepService } from '@services';
import { DepartmentVM, FormGroupVM, ProcessConnectionVM, ProcessStepVM, ProcessVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-step-update',
  templateUrl: './step-update.component.html',
  styleUrls: ['./step-update.component.scss'],
})
export class StepUpdateComponent implements OnInit {
  @Input() departments: DepartmentVM[] = [];
  @Input() process: ProcessVM;
  @Input() step: ProcessStepVM;
  @Output() useDone: EventEmitter<ProcessStepVM> = new EventEmitter<ProcessStepVM>();
  @Output() useClose: EventEmitter<ProcessStepVM> = new EventEmitter<ProcessStepVM>();
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
    protected readonly service: ProcessStepService,
    protected readonly formService: FormGroupService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      type: [undefined, [Validators.required]],
      subType: [undefined, [Validators.required]],
      department: [undefined, [Validators.required]],
      description: '',
      processFromConnections: fb.array([]),
    });
    this.form.get('type').valueChanges.subscribe((data) => {
      this.subTypes = this.types.find((e) => e.name === data) ? this.types.find((e) => e.name === data).subTypes : [];
    });
    this.formService.findAll().subscribe((data) => this.formGroups = data);
  }

  ngOnInit() {
    this.load = true;
    this.service.findById(this.step.id).subscribe((data) => {
      this.step = data;
      this.form.reset({
        name: this.step.name, description: this.step.description, type: this.step.type, subType: this.step.subType,
        department: this.step.department?.id
      });
      this.formGroups = this.formGroups.map((formGroup) => this.step.formGroups.find((e) => e.id === formGroup.id)
        ? ({ ...formGroup, isSelected: true }) : formGroup);
      (this.form.get('processFromConnections') as FormArray).clear();
      for (const connection of this.step.processFromConnections) {
        (this.form.get('processFromConnections') as FormArray).push(this.fb.group({
          ...connection,
          fromProcessStep: this.step,
        }));
      }
      this.filterSteps = this.process.processSteps.filter((step) => step.id !== this.step.id
        && (this.form.get('processFromConnections').value as ProcessConnectionVM[])
          .map((e) => e.toProcessStep).findIndex((e) => e.id === step.id) === -1
        && this.step.processFromConnections.map((e) => e.fromProcessStep).findIndex((e) => e.id === step.id) === -1);
      this.load = false;
    });
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.update({
        ...this.step, ...this.form.value, department: { id: this.form.value.department },
        formGroups: this.formGroups.filter((formGroup) => formGroup.isSelected)
      }).pipe(finalize(() => { this.load = false; })).subscribe(
        (data) => {
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
  }
  useAddConnection = (processStep: ProcessStepVM) => {
    (this.form.get('processFromConnections') as FormArray).push(this.fb.group({
      id: this.uuidv4(),
      type: '',
      description: '',
      fromProcessStep: this.step,
      toProcessStep: processStep,
    }));
    this.filterSteps = this.process.processSteps.filter((step) => step.id !== this.step.id
      && this.form.get('processFromConnections').value.map((e) => e.toProcessStep).findIndex((e) => e.id === step.id) === -1
      && this.step.processFromConnections.map((e) => e.fromProcessStep).findIndex((e) => e.id === step.id) === -1);
    this.model = undefined;
  }
  useRemoveConnection = (index: number) => {
    (this.form.get('processFromConnections') as FormArray).removeAt(index);
    this.filterSteps = this.process.processSteps.filter((step) => step.id !== this.step.id
      && this.form.get('processFromConnections').value.map((e) => e.toProcessStep).findIndex((e) => e.id === step.id) === -1
      && this.step.processFromConnections.map((e) => e.fromProcessStep).findIndex((e) => e.id === step.id) === -1);
  }
  useCheckCanSelect = () => {
    switch (this.step.type) {
      case 'activity':
        return this.form.get('processFromConnections').value.length === 0;
      case 'gateway':
        return true;
      case 'event':
        return this.step.subType === 'end' ? false : this.form.get('processFromConnections').value.length === 0;
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
  useIcon = (data: string) => {
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
