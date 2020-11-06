import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, EmailService } from '@services';
import { AccountVM, RoleVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.scss']
})
export class EmployeeCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<AccountVM> = new EventEmitter<AccountVM>();
  @Output() useClose: EventEmitter<AccountVM> = new EventEmitter<AccountVM>();
  @Input() roles: RoleVM[] = [];
  form: FormGroup;
  visible = false;
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: AccountService,
    protected readonly emailService: EmailService,
  ) {
    this.form = fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required]],
      address: '',
      avatar: undefined,
      gender: true,
      roles: [],
    });
  }

  ngOnInit() {
    this.useCheck('phone');
    this.useCheck('email');
    this.useCheck('code');
    this.useForm();
  }
  useForm = () => {
    this.form.reset({
      fullname: '', phone: '', email: '', code: '', type: 'employee', address: '', gender: true, avatar: undefined, roles: []
    });
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      const password = Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
        .map((x) => x[Math.floor(Math.random() * x.length)]).join('');
      this.service.insert({ ...this.form.value, password, roles: this.form.value.roles.map((id) => ({ id })) })
      .pipe(finalize(() => {
        this.load = false;
      }))
        .subscribe(
        async (data) => {
          swal.fire('Notification', 'Create new employee successfully!!', 'success');
          this.useDone.emit(data);
          const content =
            '<span>Email: </span> ' + data.email + '<br>' +
            '<span>Password: </span> ' + password;
          await this.emailService.sendMail({
            info: data as any, subject: 'EMPLOYEE ACCOUNT FOR SYSTEM', content
          }).toPromise();
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
  // changeAvatar = (event) => {
  //   console.log(event);
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     this.form.get('avatar').setValue(reader.result);
  //   };
  //   reader.readAsDataURL(event.target.files[0]);
  // }
}
