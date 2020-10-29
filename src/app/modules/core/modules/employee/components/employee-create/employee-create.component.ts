import { Component, OnInit, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { AccountService, EmailService } from '@services';
import { AccountVM, RoleVM } from '@view-models';
import swal from 'sweetalert2';
@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.scss']
})
export class EmployeeCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<AccountVM> = new EventEmitter<AccountVM>();
  @Input() roles: RoleVM[] = [];
  form: FormGroup;
  visible = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
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
    this.check('phone');
    this.check('email');
    this.check('code');
  }

  newForm = () => {
    this.form.reset({
      fullname: '', phone: '', email: '', code: '', type: 'employee', address: '', gender: true, avatar: undefined, roles: []
    });
  }

  open(dialog: TemplateRef<any>) {
    this.newForm();
    this.dialogService.open(dialog, { dialogClass: 'create-modal' });
  }
  submit = (ref: NbDialogRef<any>) => {
    if (this.form.valid) {
      const password = Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
        .map((x) => x[Math.floor(Math.random() * x.length)]).join('');
      this.service.insert({ ...this.form.value, password, roles: this.form.value.roles.map((id) => ({ id })) }).subscribe(
        async (data) => {
          ref.close();
          swal.fire('Notification', 'Create new employee successfully!!', 'success');
          this.useDone.emit(data);
          const content =
            '<span>Email: </span> ' + data.email + '<br>' +
            '<span>Password: </span> ' + password;
          console.log(content);
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
    // ref.close();
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
  // changeAvatar = (event) => {
  //   console.log(event);
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     this.form.get('avatar').setValue(reader.result);
  //   };
  //   reader.readAsDataURL(event.target.files[0]);
  // }
}
