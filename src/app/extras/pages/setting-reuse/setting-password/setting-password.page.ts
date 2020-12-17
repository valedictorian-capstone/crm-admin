import { Component, EventEmitter, OnDestroy, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { AuthService } from '@services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, of } from 'rxjs';
import { finalize, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-reuse-setting-password',
  templateUrl: './setting-password.page.html',
  styleUrls: ['./setting-password.page.scss']
})
export class SettingPasswordPage implements OnDestroy {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: AuthService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useInitForm();
  }
  useInitForm = () => {
    this.form = new FormGroup({
      old: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      retype: new FormControl(''),
    },
      {
        validators: (form: FormGroup) => {
          const password = form.get('password');
          const retype = form.get('retype');
          if (password.value !== retype.value) {
            form.get('retype').setErrors({ notEqual: true });
          }
          return password.value === retype.value ? null : { notEqual: true };
        }
      }
    );
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useSubmit = (ref: NbDialogRef<any>) => {
    ref.close();
    if (this.form.valid) {
      this.useShowSpinner();
      const subscription = this.service.updatePassword(this.form.value)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Change password successful!', { duration: 3000 });
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Change password fail! ' + err.error.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        )
        .subscribe()
      this.subscriptions.push(subscription);
    } else {
      this.form.markAsUntouched();
      this.form.markAsTouched();
    }
  }
  useShowSpinner = () => {
    this.spinner.show('setting-password');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('setting-password');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
