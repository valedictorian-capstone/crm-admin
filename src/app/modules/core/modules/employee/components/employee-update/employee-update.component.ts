import { Component, OnInit, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { AccountService } from '@services';
import { AccountVM, RoleVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.scss']
})
export class EmployeeUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<AccountVM> = new EventEmitter<AccountVM>();
  @Output() useClose: EventEmitter<AccountVM> = new EventEmitter<AccountVM>();
  @Input() employee: AccountVM;
  @Input() roles: RoleVM[] = [];
  form: FormGroup;
  visible = false;
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: AccountService,
  ) {
    this.form = fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: '',
      avatar: undefined,
      gender: true,
      roles: [],
    });
  }

  ngOnInit() {
    this.useForm();
    this.useCheck('phone');
    this.useCheck('email');
  }
  useForm = () => {
    this.form.reset({
      fullname: this.employee.fullname,
      phone: this.employee.phone,
      email: this.employee.email,
      address: this.employee.address,
      gender: this.employee.gender,
      avatar: this.employee.avatar,
      roles: this.employee.roles.map((group) => (group.id)),
    });
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.update({
        ...this.employee, ...this.form.value, roles: this.form.value.roles.map((id) => ({ id }))
      })
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          () => {
            swal.fire('Notification', 'Update ' + this.employee.code + ' successfully!!', 'success');
            this.useDone.emit({ ...this.employee, ...this.form.value, roles: this.form.value.roles.map((id) => ({ id })) });
          },
          (error) => {
            swal.fire('Notification', 'Something wrong on runtime! Please check again', 'error');
          }
        );
    } else {
      this.form.markAsTouched();
    }
  }
  useCheck = async (name: string) => {
    const control = this.form.get(name);
    control.valueChanges.subscribe(async (data) => {
      if (data !== '') {
        const value = await this.service.checkUnique(name, data).toPromise();
        let errors = control.errors;
        if (value && this.employee[name] !== data) {
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
  // changeAvatar = (event) => {
  //   console.log(event);
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     this.form.get('avatar').setValue(reader.result);
  //   };
  //   reader.readAsDataURL(event.target.files[0]);
  // }
}
