import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { AccountService, AuthService } from '@services';
import { AccountVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reuse-setting-profile',
  templateUrl: './setting-profile.page.html',
  styleUrls: ['./setting-profile.page.scss']
})
export class SettingProfilePage implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  profile: AccountVM;
  form: FormGroup;
  showBirthday = false;
  errorImage = false;
  message = '';
  phoneStage = 'done';
  emailStage = 'done';
  codeStage = 'done';
  constructor(
    protected readonly employeeService: AccountService,
    protected readonly authService: AuthService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useShowSpinner();
    this.useInitForm();
  }
  ngOnInit() {
    this.useLoad();
  }
  useLoad = () => {
    this.employeeService.findById(JSON.parse(localStorage.getItem('id')))
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe((data) => {
        this.form.patchValue(data);
        this.profile = data;
      });
  }
  useInitForm = () => {
    this.form = new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fullname: new FormControl(undefined, [Validators.required]),
      avatar: new FormControl(undefined),
    });
  }
  useSubmit = (ref: NbDialogRef<any>) => {
    ref.close();
    if (this.form.valid) {
      this.useShowSpinner();
      this.authService.updateProfile(this.form.value)
        .pipe(
          finalize(() => {
            this.useHideSpinner();
          })
        )
        .subscribe((data) => {
          localStorage.setItem('avatar', data.avatar);
          localStorage.setItem('fullname', data.fullname);
          this.authService.triggerValue$.next(data);
          this.toastrService.success('', 'Update profile success!', { duration: 3000 });
          this.useClose.emit();
        }, (err) => {
          this.toastrService.danger('', 'Update profile fail! Something wrong at runtime', { duration: 3000 });
        });
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
        if (files[0].size > 1024 * 1024 * 18) {
          this.errorImage = true;
          this.message = 'Only image size less than 18MB accept';
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
    if (this.profile && this.profile.phone !== this.form.get('phone').value) {
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
  useCheckEmail = () => {
    if (this.profile && this.profile.email !== this.form.get('email').value) {
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
    if (this.profile && this.profile.code !== this.form.get('code').value) {
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
    this.spinner.show('setting-profile');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('setting-profile');
    }, 1000);
  }
}
