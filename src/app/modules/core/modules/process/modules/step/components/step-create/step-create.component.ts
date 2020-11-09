import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { ProcessStepService } from '@services';
import { DepartmentVM, ProcessStepVM, ProcessVM } from '@view-models';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-step-create',
  templateUrl: './step-create.component.html',
  styleUrls: ['./step-create.component.scss']
})
export class StepCreateComponent implements OnInit {
  @Input() departments: DepartmentVM[] = [];
  @Input() process: ProcessVM;
  @Output() useDone: EventEmitter<ProcessStepVM> = new EventEmitter<ProcessStepVM>();
  @Output() useClose: EventEmitter<ProcessStepVM> = new EventEmitter<ProcessStepVM>();
  form: FormGroup;
  visible = false;
  load = false;
  types = environment.types;
  subTypes = [];
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: ProcessStepService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      subType: ['', [Validators.required]],
      department: [undefined, [Validators.required]],
      description: '',
      process: this.process
    });
  }
  ngOnInit() {
    this.form.get('type').valueChanges.subscribe((data) => {
      this.subTypes = this.types.find((e) => e.name === data) ? this.types.find((e) => e.name === data).subTypes : [];
    });
    this.useForm();
  }
  useForm = () => {
    this.form.reset({ name: '', description: '', type: '', subType: '', process: { id: this.process.id } });
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
            swal.fire('Notification', 'Create new process step successfully!!', 'success');
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
