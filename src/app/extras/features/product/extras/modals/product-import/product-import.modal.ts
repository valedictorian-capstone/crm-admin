import { Component, EventEmitter, OnDestroy, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ProductService } from '@services';
import { ProductVM } from '@view-models';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

interface IProductSavePageState {
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
      code: {
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
      code: {
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
      code: {
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
  selector: 'app-product-import-modal',
  templateUrl: './product-import.modal.html',
  styleUrls: ['./product-import.modal.scss']
})
export class ProductImportModal implements OnDestroy {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<ProductVM> = new EventEmitter<ProductVM>();
  subscriptions: Subscription[] = [];
  state: IProductSavePageState = {
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
    protected readonly service: ProductService,
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
        code: e.data.value.code as string,
      }))).toPromise();
      const success = validate.filter((e) => !e.code).map((e) => this.state.formArray.find((f) => f.extra.position === e.position));
      const error = validate.filter((e) => e.code).map((e) => this.state.formArray.find((f) => f.extra.position === e.position));
      const flag = this.state.formArray;
      this.state.formArray = success;
      if (this.state.formArray.length > 0) {
        this.service.import(success.map((e) => ({
          ...e.data.value,
          frequency: e.data.value.totalDealWon / 365
        })))
          .pipe(
            tap((x) => {
              swal.fire('Success', 'Import products succesful!', 'success');
              if (error.length > 0) {
                this.state.formArray = error.map((err) => ({
                  ...err,
                  extra: {
                    ...err.extra,
                    code: {
                      ...err.extra.code,
                      error: validate.find((va) => va.position === err.extra.position)?.code
                    },
                  }
                }));
                for (let i = 0; i < this.state.formArray.length; i++) {
                  const element = this.state.formArray[i];
                  this.useCheckValid(element.extra.position, 'code');
                }
              } else {
                this.useClose.emit();
              }
            }),
            catchError((err) => {
              swal.fire('Fail', 'Import products fail! ' + err.message, 'error');
              this.state.formArray = flag.map((err) => ({
                ...err,
                extra: {
                  ...err.extra,
                  code: {
                    ...err.extra.code,
                    error: validate.find((va) => va.position === err.extra.position)?.code
                  },
                }
              }));
              for (let i = 0; i < this.state.formArray.length; i++) {
                const element = this.state.formArray[i];
                this.useCheckValid(element.extra.position, 'code');
              }
              return of(err);
            }),
            finalize(() => {
              this.useHideSpinner();
            })
          )
          .subscribe();
      } else {
        swal.fire('Invalid', 'No valid products! Please check valid again!', 'error');
        this.state.formArray = error.map((err) => ({
          ...err,
          extra: {
            ...err.extra,
            code: {
              ...err.extra.code,
              error: validate.find((va) => va.position === err.extra.position)?.code
            },
          }
        }));
        for (let i = 0; i < this.state.formArray.length; i++) {
          const element = this.state.formArray[i];
          this.useCheckValid(element.extra.position, 'code');
        }
        this.useHideSpinner();
      }
    } else {
      swal.fire('Invalid', 'Some products invalid! Please check valid again!', 'error');
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
            this.useAddGroup(element as ProductVM, i);
          }
          for (let i = 0; i < this.state.formArray.length; i++) {
            const element = this.state.formArray[i];
            this.useValidBefore(element.extra.position, 'code');
            this.useCheckValid(element.extra.position, 'code');
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
  useAddGroup(data: ProductVM, position: number) {
    const group = new FormGroup({
      code: new FormControl(undefined, [Validators.required]),
      name: new FormControl(undefined, [Validators.required]),
      category: new FormControl(undefined, [Validators.required]),
      price: new FormControl(undefined, [Validators.required, Validators.min(0)]),
    });
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        if (group.get(key)) {
          group.get(key).setValue(element);
        }
      }
    }
    this.state.formArray.push({
      data: group,
      extra: {
        position,
        code: {
          error: undefined,
          oldValue: data.code,
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
  async useRemoveProduct(index: number) {
    const rs = await swal.fire({
      title: 'Remove this product?',
      text: 'When you click OK button, this product will remove out of list',
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
  useValidBefore(position: number, name: 'phone' | 'code') {
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
    this.spinner.show('product-import');
  }
  useHideSpinner = () => {
    this.spinner.hide('product-import');
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
        this.state.filterArray = this.state.formArray.filter((e) => e.data.invalid || e.extra.code.error);
        break;
      case 'success':
        this.state.filterArray = this.state.formArray.filter((e) => e.data.valid && !e.extra.code.error);
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
      error: this.state.formArray.filter((e) => e.data.invalid || e.extra.code.error).length,
      success: this.state.formArray.filter((e) => e.data.valid && !e.extra.code.error).length,
    }
  }
}
