import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { AccountService, AuthService } from '@services';
import { AccountVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, of } from 'rxjs';
import { finalize, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { authSelector } from '@store/selectors';

interface ISettingProfilePageState {
  you: AccountVM;
  form: FormGroup;
  showBirthday: boolean;
  errorImage: boolean;
  message: string;
  phoneStage: 'done' | 'querying';
  emailStage: 'done' | 'querying';
  codeStage: 'done' | 'querying';
}
@Component({
  selector: 'app-reuse-setting-profile',
  templateUrl: './setting-profile.page.html',
  styleUrls: ['./setting-profile.page.scss']
})
export class SettingProfilePage implements OnInit, OnDestroy {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  subscriptions: Subscription[] = [];
  state: ISettingProfilePageState = {
    you: undefined,
    form: undefined,
    showBirthday: false,
    errorImage: false,
    message: '',
    phoneStage: 'done',
    emailStage: 'done',
    codeStage: 'done',
  };
  constructor(
    protected readonly service: AuthService,
    protected readonly employeeService: AccountService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
    this.useInitForm();
  }
  ngOnInit() {
    this.useLoad();
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          if (profile) {
            this.state.you = profile;
          }
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useLoad = () => {
    this.state.form.patchValue(this.state.you);
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fullname: new FormControl(undefined, [Validators.required]),
      avatar: new FormControl(undefined),
    });
  }
  useSubmit = (ref: NbDialogRef<any>) => {
    ref.close();
    if (this.state.form.valid) {
      this.useShowSpinner();
      const subscription = this.service.updateProfile(this.state.form.value)
        .pipe(
          tap((data) => {
            localStorage.setItem('avatar', data.avatar);
            localStorage.setItem('fullname', data.fullname);
            this.service.triggerValue$.next(data);
            this.toastrService.success('', 'Update profile successful!', { duration: 3000 });
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Update profile fail! ' + err.error.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        )
        .subscribe();
      this.subscriptions.push(subscription);
    } else {
      this.state.form.markAsUntouched();
      this.state.form.markAsTouched();
    }
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useSelectImage = (event: any, input: HTMLElement) => {
    this.state.errorImage = false;
    const files: File[] = event.target.files;
    if (files.length > 1) {
      this.state.errorImage = true;
      this.state.message = 'Only one image accepted';
      input.nodeValue = undefined;
    } else {
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(files[0].type)) {
        if (files[0].size > 1024 * 1024 * 2) {
          this.state.errorImage = true;
          this.state.message = 'Only image size less than 2MB accept';
          input.nodeValue = undefined;
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.state.form.get('avatar').setValue(reader.result);
          };
          reader.readAsDataURL(files[0]);
        }
      } else {
        this.state.errorImage = true;
        this.state.message = 'Only image file accept';
        input.nodeValue = undefined;
      }
    }
  }
  useCheckPhone = () => {
    const phone = this.state.form.get('phone');
    if (this.state.you.phone !== this.state.form.get('phone').value && phone.valid) {
      this.state.phoneStage = 'querying';
      const subscription = this.employeeService.checkUnique('phone', phone.value)
        .pipe(
          tap((check) => {
            if (check) {
              phone.setErrors({ duplicate: true });
            }
          }),
          finalize(() => {
            setTimeout(async () => {
              this.state.phoneStage = 'done';
            }, 1000);
          })
        ).subscribe()
      this.subscriptions.push(subscription);
    }
  }
  useCheckEmail = () => {
    const email = this.state.form.get('email');
    if (this.state.you.email !== this.state.form.get('email').value && email.valid) {
      this.state.emailStage = 'querying';
      const subscription = this.employeeService.checkUnique('email', email.value)
        .pipe(
          tap((check) => {
            if (check) {
              email.setErrors({ duplicate: true });
            }
          }),
          finalize(() => {
            setTimeout(async () => {
              this.state.emailStage = 'done';
            }, 1000);
          })
        ).subscribe()
      this.subscriptions.push(subscription);
    }
  }
  useCheckCode = () => {
    const code = this.state.form.get('code');
    if (this.state.you.phone !== this.state.form.get('code').value && code.valid) {
      this.state.codeStage = 'querying';
      const subscription = this.employeeService.checkUnique('code', code.value)
        .pipe(
          tap((check) => {
            if (check) {
              code.setErrors({ duplicate: true });
            }
          }),
          finalize(() => {
            setTimeout(async () => {
              this.state.codeStage = 'done';
            }, 1000);
          })
        ).subscribe()
      this.subscriptions.push(subscription);
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
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
