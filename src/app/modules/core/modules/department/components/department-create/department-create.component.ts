import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '@services';
import { DepartmentVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-department-create',
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.scss']
})
export class DepartmentCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<DepartmentVM> = new EventEmitter<DepartmentVM>();
  @Output() useClose: EventEmitter<DepartmentVM> = new EventEmitter<DepartmentVM>();
  form: FormGroup;
  visible = false;
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: DepartmentService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      description: '',
    });
  }

  ngOnInit() {
    this.useForm();
    console.log('new');
  }

  useForm = () => {
    this.form.reset({ name: '', description: '' });
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
            swal.fire('Notification', 'Create new department successfully!!', 'success');
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
