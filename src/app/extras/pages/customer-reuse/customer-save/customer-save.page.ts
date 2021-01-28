import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbDialogRef, NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { CustomerService } from '@services';
import { CustomerAction } from '@store/actions';
import { authSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, CustomerVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

interface ICustomerSavePageState {
  you: AccountVM;
  form: FormGroup;
  showBirthday: boolean;
  errorImage: boolean;
  message: string;
  phoneStage: 'querying' | 'done';
  emailStage: 'querying' | 'done';
  min: Date;
  max: Date;
}
@Component({
  selector: 'app-reuse-customer-save',
  templateUrl: './customer-save.page.html',
  styleUrls: ['./customer-save.page.scss'],
})
export class CustomerSavePage implements OnInit, OnDestroy {
  @Input() payload = {
    customer: undefined,
    isProfile: false,
    inside: false,
    fullname: undefined,
  };
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<CustomerVM> = new EventEmitter<CustomerVM>();
  subscriptions: Subscription[] = [];
  state: ICustomerSavePageState = {
    you: undefined,
    form: undefined,
    showBirthday: false,
    errorImage: false,
    message: '',
    phoneStage: 'done',
    emailStage: 'done',
    max: new Date(),
    min: new Date(new Date().setFullYear(new Date().getFullYear() - 80)),
  };
  constructor(
    protected readonly service: CustomerService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
    this.useInitForm();
  }
  ngOnInit() {
    if (this.payload.inside) {
      this.state.form.get('fullname').setValue(this.payload.fullname);
    } else {
      if (this.payload.customer) {
        this.useSetData();
      }
    }
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
  useSetData = () => {
    this.useShowSpinner();
    const subscription = this.service.findById(this.payload.customer.id)
      .pipe(
        tap((data) => {
          this.store.dispatch(CustomerAction.SaveSuccessAction({ res: data }));
          this.payload.customer = {
            ...data,
            frequency: data.frequency * 365
          };
          this.state.form.addControl('id', new FormControl(this.payload.customer.id));
          this.state.form.patchValue({
            ...this.payload.customer,
            birthDay: new Date(this.payload.customer.birthDay),
          });
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(CustomerAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fullname: new FormControl(undefined, [Validators.required]),
      birthDay: new FormControl(''),
      avatar: new FormControl(undefined),
      gender: new FormControl('-1'),
      source: new FormControl('import'),

      frequency: new FormControl(0, [Validators.required]),
      totalSpending: new FormControl(0, [Validators.required]),
      totalDeal: new FormControl(0, [Validators.required]),

      skypeName: new FormControl(''),
      facebook: new FormControl(''),
      twitter: new FormControl(''),

      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),

      description: new FormControl(''),
    });
  }
  useSubmit = (ref: NbDialogRef<any>) => {
    if (!this.payload.inside) {
      ref.close();
    }
    if (this.state.form.valid && !this.payload.isProfile) {
      if (!this.payload.inside) {
        this.useShowSpinner();
      }
      const subscription = (this.payload.customer ? this.service.update({
        ...this.state.form.value,
        frequency: parseInt(this.state.form.value.frequency) / 365,
        totalSpending: parseInt(this.state.form.value.totalSpending),
        totalDeal: parseInt(this.state.form.value.totalDeal),
      }) : this.service.insert({
        ...this.state.form.value,
        frequency: parseInt(this.state.form.value.frequency)/ 365,
        totalSpending: parseInt(this.state.form.value.totalSpending),
        totalDeal: parseInt(this.state.form.value.totalDeal),
      }))
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Save customer successful!', { duration: 3000 });
            this.useDone.emit(data);
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Save customer fail! ' + err.error.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            if (!this.payload.inside) {
              this.useHideSpinner();
            }
          })
        )
        .subscribe()
      this.subscriptions.push(subscription);
    } else {
      this.state.form.markAsUntouched();
      this.state.form.markAsTouched();
    }
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useCopy = (data: string) => {
    this.clipboard.copy(data);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
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
    if ((!this.payload.customer || (this.payload.customer && this.payload.customer.phone !== phone.value)) && phone.valid) {
      this.state.phoneStage = 'querying';
      const subscription = this.service.checkUnique('phone', phone.value)
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
    if ((!this.payload.customer || (this.payload.customer && this.payload.customer.email !== this.state.form.get('email').value)) && email.valid) {
      this.state.emailStage = 'querying';
      const subscription = this.service.checkUnique('email', email.value)
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
  useShowSpinner = () => {
    this.spinner.show('customer-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('customer-save');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
