import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '@services';
import { AccountDepartmentVM, ProcessStepInstanceVM, TaskVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-instance-task-update',
  templateUrl: './instance-task-update.component.html',
  styleUrls: ['./instance-task-update.component.scss'],
  providers: [DatePipe]
})
export class InstanceTaskUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<TaskVM> = new EventEmitter<TaskVM>();
  @Output() useClose: EventEmitter<TaskVM> = new EventEmitter<TaskVM>();
  @Input() task: TaskVM;
  @Input() processStepInstance: ProcessStepInstanceVM;
  @Input() leader: AccountDepartmentVM;
  @Input() members: AccountDepartmentVM[] = [];
  form: FormGroup;
  visible = false;
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: TaskService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      description: '',
      assignBy: undefined,
      processStepInstance: undefined,
      assignee: [undefined, [Validators.required]],
      status: 'processing',
      deadline: [new Date(), [Validators.required]],
    });
  }

  ngOnInit() {
    this.useForm();
  }

  useForm = () => {
    this.form.reset({
      name: this.task.name,
      description: this.task.description,
      assignBy: this.task.assignBy,
      processStepInstance: this.processStepInstance,
      assignee: this.task.assignee.id,
      status: this.task.status,
      deadline: new Date(this.task.deadline),
    });
    console.log(this.form);
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.insert({ ...this.task, ...this.form.value, assignee: { id: this.form.value.assignee } })
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          (data) => {
            swal.fire('Notification', 'Update new task successfully!!', 'success');
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
}
