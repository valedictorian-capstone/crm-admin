import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ServiceService } from '@services';
import { ServiceVM } from '@view-models';
import swal from 'sweetalert2';
@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.scss']
})
export class ServiceCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<ServiceVM> = new EventEmitter<ServiceVM>();
  form: FormGroup;
  visible = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
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
    this.check('code');
  }

  newForm = () => {
    this.form.reset({ code: '', name: '', description: '', type: '', price: undefined });
    (this.form.get('parameters') as FormArray).clear();
  }

  open(dialog: TemplateRef<any>) {
    this.newForm();
    this.dialogService.open(dialog, { dialogClass: 'create-modal' });
  }
  submit = (ref: NbDialogRef<any>) => {
    if (this.form.valid) {
      this.service.insert(this.form.value).subscribe(
        (data) => {
          ref.close();
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
    // ref.close();
  }
  addParameter = () => {
    (this.form.get('parameters') as FormArray).push(this.fb.group({
      label: ['', Validators.required],
      value: ['', Validators.required],
    }));
  }
  removeParameter = (index: number) => {
    (this.form.get('parameters') as FormArray).removeAt(index);
  }
  check = async (name: string) => {
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
