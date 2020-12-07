import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { CustomerService } from '@services';
import { AccountVM, CustomerVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-reuse-customer-save',
  templateUrl: './customer-save.page.html',
  styleUrls: ['./customer-save.page.scss'],
  providers: [DatePipe]
})
export class CustomerSavePage implements OnInit {
  @ViewChild('submitRef') submitRef: TemplateRef<any>;
  @ViewChild('cancelRef') cancelRef: TemplateRef<any>;
  @Input() customer: CustomerVM;
  @Input() you: AccountVM;
  @Input() isProfile = false;
  @Input() inside: boolean;
  @Input() fullname: string;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<CustomerVM> = new EventEmitter<CustomerVM>();
  form: FormGroup;
  showBirthday = false;
  errorImage = false;
  message = '';
  phoneStage = 'done';
  emailStage = 'done';
  constructor(
    protected readonly datePipe: DatePipe,
    protected readonly customerService: CustomerService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
  ) {
    if (!this.inside && !this.isProfile) {
      this.useShowSpinner();
    }
    this.useInitForm();
  }

  ngOnInit() {
    if (this.inside) {
      this.form.get('fullname').setValue(this.fullname);
      this.useHideSpinner();
    } else {
      if (this.customer) {
        this.useSetData();
      } else {
        this.useHideSpinner();
      }
    }

  }
  toDateFormat = (date: Date | string) => {
    return date && !isNaN(Date.parse(date as string)) ? this.datePipe.transform(new Date(date), 'dd/MM/yyyy') : '';
  }
  useSetData = () => {
    this.customerService.findById(this.customer.id)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.spinner.hide('customer-save');
          }, 1000);
        })
      )
      .subscribe((data) => {
        this.customer = data;
        this.form.addControl('id', new FormControl(this.customer.id));
        this.form.patchValue({
          ...this.customer,
          birthDay: new Date(this.customer.birthDay),
        });
      });
  }
  useInitForm = () => {
    this.form = new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fullname: new FormControl(undefined, [Validators.required]),
      birthDay: new FormControl(''),
      avatar: new FormControl(undefined),
      gender: new FormControl('-1'),
      source: new FormControl('import'),
      type: new FormControl('personal', [Validators.required]),

      frequency: new FormControl(undefined, [Validators.required]),
      totalSpending: new FormControl(undefined, [Validators.required]),
      totalDeal: new FormControl(undefined, [Validators.required]),

      company: new FormControl(''),
      fax: new FormControl(''),
      website: new FormControl(''),

      stage: new FormControl(''),
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
    if (!this.inside) {
      ref.close();
    }
    if (this.form.valid && !this.isProfile) {
      if (!this.inside) {
        this.useShowSpinner();
      }
      (this.customer ? this.customerService.update({
        ...this.form.value,
        frequency: parseInt(this.form.value.frequency, 0),
        totalSpending: parseInt(this.form.value.totalSpending, 0),
        totalDeal: parseInt(this.form.value.totalDeal, 0),
      }) : this.customerService.insert({
        ...this.form.value,
        frequency: parseInt(this.form.value.frequency, 0),
        totalSpending: parseInt(this.form.value.totalSpending, 0),
        totalDeal: parseInt(this.form.value.totalDeal, 0),
      }))
        .pipe(
          finalize(() => {
            if (!this.inside) {
              this.useHideSpinner();
            }
          })
        )
        .subscribe((data) => {
          this.toastrService.success('', 'Save customer successful!', { duration: 3000 });
          this.useDone.emit(data);
          this.useClose.emit();
        }, (err) => {
          this.toastrService.danger('', 'Save customer fail! Something wrong at runtime', { duration: 3000 });
        });
    } else {
      this.form.markAsUntouched();
      this.form.markAsTouched();
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
    const phone = this.form.get('phone');
    if ((!this.customer || (this.customer && this.customer.phone !== phone.value) ) && phone.valid) {
      this.phoneStage = 'querying';
      setTimeout(async () => {
        const check = await this.customerService.checkUnique('phone', phone.value).toPromise();
        if (check) {
          phone.setErrors({ duplicate: true });
        }
        this.phoneStage = 'done';
      }, 1000);
    }

  }
  useCheckEmail = () => {
    const email = this.form.get('email');
    if ((!this.customer || (this.customer && this.customer.email !== this.form.get('email').value)) && email.valid) {
      this.emailStage = 'querying';
      setTimeout(async () => {
        const check = await this.customerService.checkUnique('email', email.value).toPromise();
        if (check) {
          email.setErrors({ duplicate: true });
        }
        this.emailStage = 'done';
      }, 1000);
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
}
