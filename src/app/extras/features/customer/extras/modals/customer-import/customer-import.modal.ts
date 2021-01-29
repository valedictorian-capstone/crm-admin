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
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { NzUploadFile } from 'ng-zorro-antd/upload';

interface ICustomerSavePageState {
  min: Date;
  max: Date;
  position: number;
  index: number;
  maxCount: number[];
  status: string;
  formArray: {
    data: FormGroup,
    extra: {
      position: number,
      email: {
        error: string,
        oldValue: string,
        anotherDuplicatePosition: number[],
      },
      phone: {
        error: string,
        oldValue: string,
        anotherDuplicatePosition: number[],
      },
      image: string,
      showBirthday: boolean,
    }
  }[],
  filterArray: {
    data: FormGroup,
    extra: {
      position: number,
      email: {
        error: string,
        oldValue: string,
        anotherDuplicatePosition: number[],
      },
      phone: {
        error: string,
        oldValue: string,
        anotherDuplicatePosition: number[],
      },
      image: string,
      showBirthday: boolean,
    }
  }[],
  paginationArray: {
    extra: {
      position: number,
      email: {
        error: string,
        oldValue: string,
        anotherDuplicatePosition: number[],
      },
      phone: {
        error: string,
        oldValue: string,
        anotherDuplicatePosition: number[],
      },
      image: string,
      showBirthday: boolean,
    }
  }[],
}

@Component({
  selector: 'app-customer-import-modal',
  templateUrl: './customer-import.modal.html',
  styleUrls: ['./customer-import.modal.scss']
})
export class CustomerImportModal implements OnDestroy {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<CustomerVM> = new EventEmitter<CustomerVM>();
  subscriptions: Subscription[] = [];
  state: ICustomerSavePageState = {
    max: new Date(),
    min: new Date(new Date().setFullYear(new Date().getFullYear() - 80)),
    formArray: [],
    filterArray: [],
    status: 'all',
    paginationArray: [],
    position: -1,
    index: 1,
    maxCount: [],
  };

  constructor(
    protected readonly service: CustomerService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
  ) {
  }
  useSubmit = async (ref: NbDialogRef<any>) => {
    ref.close();
    if (this.useCheck().error === 0) {
      this.useShowSpinner();
      const validate = await this.service.valid(this.state.formArray.map((e) => ({
        position: e.extra.position,
        email: e.data.value.email as string,
        phone: e.data.value.phone as string,
      }))).toPromise();
      const success = validate.filter((e) => !e.email && !e.phone).map((e) => this.state.formArray.find((f) => f.extra.position === e.position));
      const error = validate.filter((e) => e.email || e.phone).map((e) => this.state.formArray.find((f) => f.extra.position === e.position));
      const flag = this.state.formArray;
      this.state.formArray = success;
      if (this.state.formArray.length > 0) {
        this.service.import(success.map((e) => ({
          ...e.data.value,
          frequency: e.data.value.totalDealWon / 365
        })))
          .pipe(
            tap((x) => {
              swal.fire('Success', 'Import customers succesful!', 'success');
              if (error.length > 0) {
                this.state.formArray = error.map((err) => ({
                  ...err,
                  extra: {
                    ...err.extra,
                    email: {
                      ...err.extra.email,
                      error: validate.find((va) => va.position === err.extra.position)?.email
                    },
                    phone: {
                      ...err.extra.phone,
                      error: validate.find((va) => va.position === err.extra.position)?.phone
                    }
                  }
                }));
                for (let i = 0; i < this.state.formArray.length; i++) {
                  const element = this.state.formArray[i];
                  this.useCheckValid(element.extra.position, 'email');
                  this.useCheckValid(element.extra.position, 'phone');
                }
              } else {
                this.useClose.emit();
              }
            }),
            catchError((err) => {
              swal.fire('Fail', 'Import customers fail! ' + err.message, 'error');
              this.state.formArray = flag.map((err) => ({
                ...err,
                extra: {
                  ...err.extra,
                  email: {
                    ...err.extra.email,
                    error: validate.find((va) => va.position === err.extra.position)?.email
                  },
                  phone: {
                    ...err.extra.phone,
                    error: validate.find((va) => va.position === err.extra.position)?.phone
                  }
                }
              }));
              for (let i = 0; i < this.state.formArray.length; i++) {
                const element = this.state.formArray[i];
                this.useCheckValid(element.extra.position, 'email');
                this.useCheckValid(element.extra.position, 'phone');
              }
              return of(err);
            }),
            finalize(() => {
              this.useHideSpinner();
            })
          )
          .subscribe();
      } else {
        swal.fire('Invalid', 'No valid customers! Please check valid again!', 'error');
        this.state.formArray = error.map((err) => ({
          ...err,
          extra: {
            ...err.extra,
            email: {
              ...err.extra.email,
              error: validate.find((va) => va.position === err.extra.position)?.email
            },
            phone: {
              ...err.extra.phone,
              error: validate.find((va) => va.position === err.extra.position)?.phone
            }
          }
        }));
        for (let i = 0; i < this.state.formArray.length; i++) {
          const element = this.state.formArray[i];
          this.useCheckValid(element.extra.position, 'email');
          this.useCheckValid(element.extra.position, 'phone');
        }
      }
    } else {
      swal.fire('Invalid', 'Some customers invalid! Please check valid again!', 'error');
    }
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useChange = (file: NzUploadFile) => {
    if (file.name.match(/(.xls|.xlsx)/)) {
      const reader: FileReader = new FileReader();
      reader.onloadend = async () => {
        const bstr: string | ArrayBuffer = reader.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        if (data.length > 1000) {
          swal.fire('', 'Max size is 1000 rows', 'error');
        } else if (data.length === 0) {
          swal.fire('', 'This file is empty', 'error');
        } else {
          this.state.formArray = [];
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            this.useAddGroup(element as CustomerVM, i);
          }
          for (let i = 0; i < this.state.formArray.length; i++) {
            const element = this.state.formArray[i];
            this.useValidBefore(element.extra.position, 'email');
            this.useValidBefore(element.extra.position, 'phone');
            this.useCheckValid(element.extra.position, 'email');
            this.useCheckValid(element.extra.position, 'phone');
          }
          this.useFilter('all');
        }
      };
      reader.readAsBinaryString(file as any);
    } else {
      swal.fire('', 'This file is not follow extendsion', 'error');
    }
    return false;
  }
  useCalculateMax() {
    if (this.state.filterArray.length > 50) {
      this.state.maxCount = [];
      const max = Math.floor(this.state.filterArray.length / 50) + (this.state.filterArray.length % 50 > 0 ? 1 : 0);
      for (let i = 1; i <= max; i++) {
        this.state.maxCount.push(i);
      }
    } else {
      this.state.maxCount = [1];
    }
  }
  useAddGroup(data: CustomerVM, position: number) {
    const group = new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fullname: new FormControl(undefined, [Validators.required]),
      birthDay: new FormControl(undefined),
      avatar: new FormControl(undefined),
      gender: new FormControl('-1'),
      source: new FormControl('import'),

      totalDealWon: new FormControl(0, [Validators.required, Validators.min(0)]),
      totalSpending: new FormControl(0, [Validators.required, Validators.min(0)]),
      totalDeal: new FormControl(0, [Validators.required, Validators.min(0)]),

      skypeName: new FormControl(''),
      facebook: new FormControl(''),
      twitter: new FormControl(''),

      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),

      description: new FormControl(''),
    });
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        if (group.get(key)) {
          if (key === 'birthDay') {
            if (element) {
              console.log(typeof element);
              if (typeof element === 'string') {
                const d = new Date(element);
                console.log(d);
                if ((d as any) == 'Invalid Date') {
                  group.get(key).setValue(undefined);
                  group.get(key).setErrors({ required: true });
                } else {
                  group.get(key).setValue(new Date((element)));
                }
              } else if (typeof element === 'number') {
                group.get(key).setValue(new Date((element - (25567 + 2)) * 86400 * 1000));
              }
            }
          } else if (key === 'gender') {
            switch (element.toLowerCase()) {
              case 'male':
                group.get(key).setValue('0');
                break;
              case 'female':
                group.get(key).setValue('1');
                break;
              case 'other':
                group.get(key).setValue('2');
                break;
              default:
                group.get(key).setValue('-1');
                break;
            }
          } else {
            group.get(key).setValue(element);
          }
        }
      }
    }
    this.state.formArray.push({
      data: group,
      extra: {
        position,
        email: {
          error: undefined,
          oldValue: data.email,
          anotherDuplicatePosition: [],
        },
        phone: {
          error: undefined,
          oldValue: data.phone,
          anotherDuplicatePosition: [],
        },
        image: undefined,
        showBirthday: undefined,
      }
    });
  }
  useReset() {
    this.state = {
      max: new Date(),
      min: new Date(new Date().setFullYear(new Date().getFullYear() - 80)),
      formArray: [],
      status: 'all',
      filterArray: [],
      paginationArray: [],
      position: -1,
      index: 1,
      maxCount: [],
    };
  }
  async useRemoveCustomer(index: number) {
    const rs = await swal.fire({
      title: 'Remove this customer?',
      text: 'When you click OK button, this customer will remove out of list',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      this.state.position = -1;
      this.state.formArray = this.state.formArray.filter((e) => e.extra.position !== index);
      if (this.state.maxCount.length < this.state.index) {
        this.state.index = this.state.maxCount.length
      }
      this.useFilter(this.state.status);
    }
  }
  useIndex(index: number) {
    this.state.paginationArray = this.state.filterArray.filter((e, i) => {
      const s = i + 1;
      const page = index * 50;
      return s >= page - (50 - 1) && s <= page;
    });
  }
  useCheckValid(position: number, name: string) {
    const content = this.state.formArray.find((e) => e.extra.position === position);
    const control = content.data.get(name);
    control.valueChanges
      .pipe(
        tap(() => {
          this.useValid(position, name);
        })
      )
      .subscribe()
  }
  useValid(position: number, name: string) {
    const content = this.state.formArray.find((e) => e.extra.position === position);
    const control = content.data.get(name);
    if (control.value?.toString().toLowerCase() !== content.extra[name].oldValue?.toString().toLowerCase()) {
      console.log('diff', content.extra[name].anotherDuplicatePosition);
      for (let i = 0; i < content.extra[name].anotherDuplicatePosition.length; i++) {
        const element = content.extra[name].anotherDuplicatePosition[i];
        this.useValid(element, name);
      }
    }
    const newDuplicated = this.state.formArray.filter((e) => e.extra.position !== content.extra.position && e.data.get(name).value?.toString().toLowerCase() === control.value?.toString().toLowerCase());
    content.extra[name].oldValue = control.value;
    content.extra[name].anotherDuplicatePosition = newDuplicated.map((e) => e.extra.position);
    if (newDuplicated.length === 0) {
      if (control.valid) {
        const subscription = this.service.checkUnique(name, control.value)
          .pipe(
            tap((check) => {
              if (check) {
                content.extra[name].error = 'Existed in system';
                control.setErrors({ duplicate: true });
              } else {
                content.extra[name].error = undefined;
                control.setErrors(null);
              }
            }),
          ).subscribe()
        this.subscriptions.push(subscription);
      }
    } else {
      console.log(newDuplicated);
      content.extra[name].error = 'Duplicated with position: [' + newDuplicated.map((e) => e.extra.position).join(', ') + ']';
      control.setErrors({ duplicate: true });
    }
  }
  useValidBefore(position: number, name: 'phone' | 'email') {
    const content = this.state.formArray.find((e) => e.extra.position === position);
    const control = content.data.get(name);
    const anotherDuplicate = this.state.formArray.filter((e) => e.extra.position !== content.extra.position && e.data.get(name).value?.toString().toLowerCase() === control.value?.toString().toLowerCase());
    content.extra[name].oldValue = control.value;
    content.extra[name].anotherDuplicatePosition = anotherDuplicate.map((e) => e.extra.position);
    console.log(position + '-', anotherDuplicate.map((e) => e.extra.position).join(','));
    if (control.valid) {
      if (anotherDuplicate.length > 0) {
        content.extra[name].error = 'Duplicated with position: [' + anotherDuplicate.map((e) => e.extra.position).join(', ') + ']';
        control.setErrors({ duplicate: true });
      } else {
        content.extra[name].error = undefined;
        control.setErrors(null);
      }
    }
  }
  useShowSpinner = () => {
    this.spinner.show('customer-import');
  }
  useHideSpinner = () => {
    this.spinner.hide('customer-import');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
  useFilter(type: string) {
    this.state.status = type;
    switch (type) {
      case 'all':
        this.state.filterArray = this.state.formArray;
        break;
      case 'error':
        this.state.filterArray = this.state.formArray.filter((e) => e.data.invalid || e.extra.phone.error || e.extra.email.error);
        break;
      case 'success':
        this.state.filterArray = this.state.formArray.filter((e) => e.data.valid && !e.extra.phone.error && !e.extra.email.error);
        break;
      default:
        this.state.filterArray = [];
        break;
    }
    this.useCalculateMax();
    this.useIndex(1);
  }
  useCheck() {
    return {
      error: this.state.formArray.filter((e) => e.data.invalid || e.extra.phone.error || e.extra.email.error).length,
      success: this.state.formArray.filter((e) => e.data.valid && !e.extra.phone.error && !e.extra.email.error).length,
    }
  }
}
