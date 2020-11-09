import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '@services';
import { AccountDepartmentVM, AccountVM, ProcessStepInstanceVM, TaskVM } from '@view-models';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-instance-task-create',
  templateUrl: './instance-task-create.component.html',
  styleUrls: ['./instance-task-create.component.scss'],
  providers: [DatePipe]
})
export class InstanceTaskCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<TaskVM> = new EventEmitter<TaskVM>();
  @Output() useClose: EventEmitter<TaskVM> = new EventEmitter<TaskVM>();
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
      name: '',
      description: '',
      assignBy: this.leader.account,
      processStepInstance: this.processStepInstance,
      assignee: undefined,
      status: 'processing',
      deadline: new Date(),
    });
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.insert(this.form.value)
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          (data) => {
            swal.fire('Notification', 'Create new task successfully!!', 'success');
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
