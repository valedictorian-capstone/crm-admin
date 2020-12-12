import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AccountService } from '@services';
import { RoleAction } from '@store/actions';
import { authSelector, roleSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, RoleVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

interface IEmployeeSavePageState {
  you: AccountVM;
  form: FormGroup;
  roles: RoleVM[];
  showBirthday: boolean;
  errorImage: boolean;
  message: string;
  phoneStage: 'done' | 'querying';
  emailStage: 'done' | 'querying';
  codeStage: 'done' | 'querying';
  level: number;
}
@Component({
  selector: 'app-reuse-employee-save',
  templateUrl: './employee-save.page.html',
  styleUrls: ['./employee-save.page.scss']
})
export class EmployeeSavePage implements OnInit, OnDestroy {
  @Input() payload: { employee: AccountVM, isProfile: boolean } = {
    employee: undefined,
    isProfile: false
  };
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<AccountVM> = new EventEmitter<AccountVM>();
  subscriptions: Subscription[] = [];
  state: IEmployeeSavePageState = {
      you: undefined,
      form: undefined,
      roles: [],
      showBirthday: false,
      errorImage: false,
      message: '',
      phoneStage: 'done',
      emailStage: 'done',
      codeStage: 'done',
      level: 9999
    };
  constructor(
    protected readonly service: AccountService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
    protected readonly store: Store<State>
  ) {
    this.useShowSpinner();
    this.useLoadMine();
    this.useDispatch();
    this.useData();
    this.useInitForm();

  }

  ngOnInit() {
    if (!this.payload.employee) {
      this.state.form.addControl('password', new FormControl(Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
        .map((x) => x[Math.floor(Math.random() * x.length)]).join('')));
    } else {
      this.useSetData();
    }
    this.useHideSpinner();
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select(roleSelector.firstLoad)
        .pipe(
          tap((firstLoad) => {
            if (!firstLoad) {
              this.store.dispatch(RoleAction.FindAllAction({}));
            }
          })
        ).subscribe()
    );
  }
  useData = () => {
    this.subscriptions.push(
      this.store.select(roleSelector.roles)
        .pipe(
          tap((data) => {
            this.state.roles = data.filter((e) => e.level > this.state.level);;
          })
        ).subscribe()
    );
  }
  useLoadMine = () => {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            this.state.you = profile;
            this.state.level = Math.min(...this.state.you.roles.map((e) => e.level));
          })
        )
        .subscribe()
    );
  }
  useSetData = () => {
    this.state.form.addControl('id', new FormControl(this.payload.employee.id));
    this.state.form.patchValue({
      ...this.payload.employee,
      roles: this.payload.employee.roles.map((role) => role.id)
    });
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
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
    if (this.state.form.valid && !this.payload.isProfile) {
      this.useShowSpinner();
      this.subscriptions.push(
        (this.payload.employee ? this.service.update({
          ...this.state.form.value,
          roles: this.state.form.value.roles.map((e) => ({ id: e }))
        }) : this.service.insert({
          ...this.state.form.value,
          roles: this.state.form.value.roles.map((e) => ({ id: e }))
        }))
          .pipe(
            tap((data) => {
              this.toastrService.success('', 'Save account successful!', { duration: 3000 });
              this.useDone.emit(data);
              this.useClose.emit();
            }),
            catchError((err) => {
              this.toastrService.danger('', 'Save account fail! ' + err.error.message, { duration: 3000 });
              return of(undefined);
            }),
            finalize(() => {
              this.useHideSpinner();
            })
          )
          .subscribe()
      );
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
        if (files[0].size > 1024 * 1024 * 18) {
          this.state.errorImage = true;
          this.state.message = 'Only image size less than 18MB accept';
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
  useCopy = (data: string) => {
    this.clipboard.copy(data);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useCheckPhone = () => {
    const phone = this.state.form.get('phone');
    if ((!this.payload.employee || (this.payload.employee && this.payload.employee.phone !== this.state.form.get('phone').value)) && phone.valid) {
      this.state.phoneStage = 'querying';
      this.subscriptions.push(
        this.service.checkUnique('phone', phone.value)
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
      );
    }
  }
  useCheckEmail = () => {
    const email = this.state.form.get('email');
    if ((!this.payload.employee || (this.payload.employee && this.payload.employee.email !== this.state.form.get('email').value)) && email.valid) {
      this.state.emailStage = 'querying';
      this.subscriptions.push(
        this.service.checkUnique('email', email.value)
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
      );
    }
  }
  useCheckCode = () => {
    const code = this.state.form.get('code');
    if ((!this.payload.employee || (this.payload.employee && this.payload.employee.code !== this.state.form.get('code').value)) && code.valid) {
      this.state.codeStage = 'querying';
      this.subscriptions.push(
        this.service.checkUnique('code', code.value)
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
      );
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
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
