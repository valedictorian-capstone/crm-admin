import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '@services';
import { ServiceVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.scss']
})
export class ServiceCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<ServiceVM> = new EventEmitter<ServiceVM>();
  @Output() useClose: EventEmitter<ServiceVM> = new EventEmitter<ServiceVM>();
  form: FormGroup;
  visible = false;
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: ServiceService,
  ) {
    this.form = fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      type: '',
      price: [undefined, [Validators.required]],
      description: '',
      parameters: fb.array([]),
    });
  }

  ngOnInit() {
    this.useCheck('code');
    this.useForm();
  }

  useForm = () => {
    this.form.reset({ code: '', name: '', description: '', type: '', price: undefined });
    (this.form.get('parameters') as FormArray).clear();
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
            swal.fire('Notification', 'Create new service successfully!!', 'success');
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
  useAddParameter = () => {
    (this.form.get('parameters') as FormArray).push(this.fb.group({
      label: ['', Validators.required],
      value: ['', Validators.required],
    }));
  }
  useRemoveParameter = (index: number) => {
    (this.form.get('parameters') as FormArray).removeAt(index);
  }
  useCheck = async (name: string) => {
    const control = this.form.get(name);
    control.valueChanges.subscribe(async (data) => {
      if (data !== '') {
        const value = await this.service.checkUnique(name, data).toPromise();
        let errors = control.errors;
        if (value) {
          errors = errors == null ? {} : errors;
          errors.unique = true;
        } else {
          if (errors?.unique) {
            delete errors.unique;
          }
        }
        control.setErrors(errors);
      }
    });
  }
}
