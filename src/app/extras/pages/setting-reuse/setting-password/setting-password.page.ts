import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { AuthService } from '@services';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reuse-setting-password',
  templateUrl: './setting-password.page.html',
  styleUrls: ['./setting-password.page.scss']
})
export class SettingPasswordPage implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  constructor(
    protected readonly authService: AuthService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useInitForm();
  }
  ngOnInit() {
  }
  useInitForm = () => {
    this.form = new FormGroup({
      password: new FormControl('', [Validators.required]),
      retype: new FormControl('', [Validators.required]),
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
      setTimeout(() => {
        this.authService.updatePassword(this.form.value)
          .pipe(
            finalize(() => {
              this.useHideSpinner();
            })
          )
          .subscribe((data) => {
            this.toastrService.success('', 'Change password success!', { duration: 3000 });
            this.useClose.emit();
          }, (err) => {
            this.toastrService.danger('', 'Change password fail! Something wrong at runtime', { duration: 3000 });
          });
      }, 2000);
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
}
