import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { AccountService, RoleService } from '@services';
import { AccountVM, RoleVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-reuse-employee-save',
  templateUrl: './employee-save.page.html',
  styleUrls: ['./employee-save.page.scss']
})
export class EmployeeSavePage implements OnInit {
  @Input() employee: AccountVM;
  @Input() isProfile: boolean;
  @ViewChild('submitRef') submitRef: TemplateRef<any>;
  @ViewChild('cancelRef') cancelRef: TemplateRef<any>;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<AccountVM> = new EventEmitter<AccountVM>();
  form: FormGroup;
  roles: RoleVM[] = [];
  showBirthday = false;
  errorImage = false;
  message = '';
  phoneStage = 'done';
  emailStage = 'done';
  codeStage = 'done';
  level = -1;
  constructor(
    protected readonly employeeService: AccountService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
    protected readonly roleService: RoleService,
  ) {
    this.useShowSpinner();
    this.useInitForm();

  }

  ngOnInit() {
    this.roleService.findAll().subscribe((data) => {
      this.roles = data;
      this.useHideSpinner();
    });
    if (!this.employee) {
      this.form.addControl('password', new FormControl(Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
        .map((x) => x[Math.floor(Math.random() * x.length)]).join('')));
    } else {
      this.useSetData();
    }
  }
  useSetData = () => {
    this.form.addControl('id', new FormControl(this.employee.id));
    this.form.patchValue(this.employee);
  }
  useInitForm = () => {
    this.form = new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fullname: new FormControl(undefined, [Validators.required]),
      code: new FormControl(undefined, [Validators.required]),
      avatar: new FormControl(undefined),
      roles: new FormControl([], [Validators.required]),
    });
  }
  useSubmit = (ref: NbDialogRef<any>) => {
    ref.close();
    if (this.form.valid && !this.isProfile) {
      this.useShowSpinner();
      setTimeout(() => {
        (this.employee ? this.employeeService.update(this.form.value) : this.employeeService.insert(this.form.value))
          .pipe(
            finalize(() => {
              this.useHideSpinner();
            })
          )
          .subscribe((data) => {
            this.employeeService.triggerValue$.next({ type: this.employee ? 'update' : 'create', data });
            this.toastrService.success('', 'Save employee success!', { duration: 3000 });
            this.useDone.emit(data);
            this.useClose.emit();
          }, (err) => {
            this.toastrService.danger('', 'Save employee fail! Something wrong at runtime', { duration: 3000 });
          });
      }, 2000);
    } else {
      this.form.markAsUntouched();
      this.form.markAsTouched();
    }
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useSelectImage = (event: any, input: HTMLElement) => {
    this.errorImage = false;
    const files: File[] = event.target.files;
    if (files.length > 1) {
      this.errorImage = true;
      this.message = 'Only one image accepted';
      input.nodeValue = undefined;
    } else {
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(files[0].type)) {
        if (files[0].size > 1024 * 1024 * 2) {
          this.errorImage = true;
          this.message = 'Only image size less than 2MB accept';
          input.nodeValue = undefined;
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.form.get('avatar').setValue(reader.result);
          };
          reader.readAsDataURL(files[0]);
        }
      } else {
        this.errorImage = true;
        this.message = 'Only image file accept';
        input.nodeValue = undefined;
      }
    }
  }
  useCheckPhone = () => {
    if (!this.employee || (this.employee && this.employee.phone !== this.form.get('phone').value)) {
      this.phoneStage = 'querying';
      setTimeout(async () => {
        const phone = this.form.get('phone');
        const check = await this.employeeService.checkUnique('phone', phone.value).toPromise();
        if (phone.valid && check) {
          phone.setErrors({ duplicate: true });
        }
        this.phoneStage = 'done';
      }, 1000);
    }
  }
  useCopy = (data: string) => {
    this.clipboard.copy(data);
    this.toastrService.show('', 'Copy success', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useCheckEmail = () => {
    if (!this.employee || (this.employee && this.employee.email !== this.form.get('email').value)) {
      this.emailStage = 'querying';
      setTimeout(async () => {
        const email = this.form.get('email');
        const check = await this.employeeService.checkUnique('email', email.value).toPromise();
        if (email.valid && check) {
          email.setErrors({ duplicate: true });
        }
        this.emailStage = 'done';
      }, 1000);
    }
  }
  useCheckCode = () => {
    if (!this.employee || (this.employee && this.employee.code !== this.form.get('code').value)) {
      this.codeStage = 'querying';
      setTimeout(async () => {
        const code = this.form.get('code');
        const check = await this.employeeService.checkUnique('code', code.value).toPromise();
        if (code.valid && check) {
          code.setErrors({ duplicate: true });
        }
        this.codeStage = 'done';
      }, 1000);
    }
  }
  useShowSpinner = () => {
    this.spinner.show('employee-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('employee-save');
    }, 1000);
  }
}
