import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcessInstanceService } from '@services';
import { CustomerVM, ProcessInstanceVM, ProcessVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-instance-create',
  templateUrl: './instance-create.component.html',
  styleUrls: ['./instance-create.component.scss']
})
export class InstanceCreateComponent implements OnInit {
  @Input() customers: CustomerVM[] = [];
  @Input() process: ProcessVM;
  @Output() useDone: EventEmitter<ProcessInstanceVM> = new EventEmitter<ProcessInstanceVM>();
  @Output() useClose: EventEmitter<ProcessInstanceVM> = new EventEmitter<ProcessInstanceVM>();
  form: FormGroup;
  visible = false;
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: ProcessInstanceService,
  ) {
    this.form = fb.group({
      process: this.process,
      customer: [undefined, Validators.required],
      description: '',
    });
  }
  ngOnInit() {
    this.useForm();
  }
  useForm = () => {
    this.form.reset({ description: '', process: this.process, customer: undefined });
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.insert({...this.form.value, customer: this.customers.find((e) => e.id === this.form.value.customer)})
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          (data) => {
            swal.fire('Notification', 'Create new instance successfully!!', 'success');
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

}
