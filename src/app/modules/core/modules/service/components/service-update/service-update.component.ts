import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '@services';
import { ServiceVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-service-update',
  templateUrl: './service-update.component.html',
  styleUrls: ['./service-update.component.scss']
})
export class ServiceUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<ServiceVM> = new EventEmitter<ServiceVM>();
  @Output() useClose: EventEmitter<ServiceVM> = new EventEmitter<ServiceVM>();
  // tslint:disable-next-line: variable-name
  @Input() _service: ServiceVM;
  form: FormGroup;
  visible = false;
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: ServiceService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      type: '',
      price: [undefined, [Validators.required]],
      description: '',
      parameters: fb.array([]),
    });
  }

  ngOnInit() {
    this.useForm();
  }

  useForm = () => {
    this.form.reset({
      name: this._service.name,
      description: this._service.description,
      type: this._service.type,
      price: this._service.price
    });
    (this.form.get('parameters') as FormArray).clear();
    for (const parameter of this._service.parameters) {
      (this.form.get('parameters') as FormArray).push(this.fb.group({
        label: [parameter.label, Validators.required],
        value: [parameter.value, Validators.required],
      }));
    }
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.update({ ...this._service, ...this.form.value })
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          () => {
            swal.fire('Notification', 'Update service successfully!!', 'success');
            this.useDone.emit({ ...this._service, ...this.form.value });
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
}
