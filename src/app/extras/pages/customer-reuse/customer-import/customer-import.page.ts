import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { CustomerService } from '@services';
import { CustomerVM } from '@view-models';
import { Subscription, of, merge } from 'rxjs';
import { finalize, tap, catchError, debounceTime, combineAll } from 'rxjs/operators';
import * as XLSX from 'xlsx';
interface ICustomerImportPageState {
  array: FormArray;
  page: number;
}
@Component({
  selector: 'app-customer-r-import',
  templateUrl: './customer-import.page.html',
  styleUrls: ['./customer-import.page.scss'],
})
export class CustomerImportPage implements OnChanges, AfterViewInit, OnDestroy {
  @Input() data: CustomerVM[];
  @Output() useChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() useTextLoading: EventEmitter<string> = new EventEmitter<string>();
  @Output() useLoading: EventEmitter<any> = new EventEmitter<any>();
  @Output() useUnLoading: EventEmitter<any> = new EventEmitter<any>();
  subscriptions: Subscription[] = [];
  state: ICustomerImportPageState = {
    array: new FormArray([]),
    page: 1
  };
  sortBy = {
    key: undefined,
    stage: 'up',
  };
  constructor(
    protected readonly service: CustomerService,
    protected readonly toastrService: NbToastrService,
    protected readonly cdr: ChangeDetectorRef
  ) { }
  async ngOnChanges() {
    if (this.data) {
      this.state.array.clear();
      for (let i = 0; i < this.data.length; i++) {
        const item = this.data[i];
        const group = new FormGroup({
          phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
          email: new FormControl('', [Validators.required, Validators.email]),
          fullname: new FormControl(undefined, [Validators.required]),
          birthDay: new FormControl(undefined),
          avatar: new FormControl(undefined),
          gender: new FormControl('-1'),
          phoneStage: new FormControl('done'),
          emailStage: new FormControl('done'),
          showBirthday: new FormControl(false),
          errorImage: new FormControl(false),
          errorImageMessage: new FormControl(''),
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
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const element = item[key];
            if (group.get(key)) {
              if (key === 'birthDay') {
                if (element) {
                  if (typeof element === 'string') {
                    group.get(key).setValue(new Date((element)));
                  } else {
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
        group['id'] = new FormControl(Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
          .map((x) => x[Math.floor(Math.random() * x.length)]).join(''));
          group['position'] = i + 1;
        this.state.array.push(group);
      }
      this.state.array.controls.forEach(async (group, i) => {
        const phone = group.get('phone');
        const email = group.get('email');
        if (phone.valid) {
          group.get('phoneStage').setValue('querying');
          this.service.checkUnique('phone', phone.value)
            .pipe(
              tap((checkPhone) => {
                if (checkPhone) {
                  phone.setErrors({ duplicate: true });
                }
              }),
              finalize(() => {
                group.get('phoneStage').setValue('done');
              })
            ).subscribe();
        }
        if (email.valid) {
          group.get('emailStage').setValue('querying');
          this.service.checkUnique('email', email.value)
            .pipe(
              tap((checkPhone) => {
                if (checkPhone) {
                  email.setErrors({ duplicate: true });
                }
              }),
              finalize(() => {
                group.get('emailStage').setValue('done');
              })
            ).subscribe();
        }
        phone.valueChanges.pipe(
          debounceTime(250),
          tap(async () => {
            console.log('changes');
            if (phone.valid) {
              group.get('phoneStage').setValue('querying');
              const checkPhone = await this.service.checkUnique('phone', phone.value).toPromise();
              if (checkPhone) {
                phone.setErrors({ duplicate: true });
              } else {
                phone.setErrors(null);
              }
              group.get('phoneStage').setValue('done');
            }
          })
        ).subscribe();
        email.valueChanges.pipe(
          debounceTime(250),
          tap(async () => {

            if (email.valid) {
              group.get('emailStage').setValue('querying');
              const checkPhone = await this.service.checkUnique('email', email.value).toPromise();
              if (checkPhone) {
                email.setErrors({ duplicate: true });
              } else {
                email.setErrors(null);
              }
              group.get('emailStage').setValue('done');
            }
          })
        ).subscribe();
      });
    }
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
  useDownload = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [
      { width: 20 },
      { width: 40 },
      { width: 40 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 50 },
      { width: 20 },
      { width: 40 },
      { width: 40 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 40 },
      { width: 40 },
      { width: 20 },
      { width: 20 },
      { width: 20 }
    ];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customer Example Import');
    XLSX.writeFile(wb, 'customer-example-' + new Date().getTime() + '.xlsx');
  }
  useImport = () => {
    const array = this.state.array.controls.filter((e) => e.valid);
    if (array.length > 0) {
      let count = 0;
      this.useTextLoading.emit(count + '/' + array.length);
      this.useLoading.emit();
      const combines = [];
      let start = 0;
      while (start < array.length - 1) {
        if (start + 10 <= array.length - 1) {
          const data = array.slice(start, start + 11);
          combines.push(
            this.service.import(data.map((e) => ({
              ...e.value,
              frequency: parseInt(e.value.frequency, 0) / 365,
              totalSpending: parseInt(e.value.totalSpending, 0),
              totalDeal: parseInt(e.value.totalDeal, 0),
            }))).pipe(
              tap(() => {
                this.toastrService.success('', 'Import 10 customers successful!', { duration: 3000 });
                count += 10;
                this.useTextLoading.emit(count + '/' + array.length);
                this.state.array.controls = this.state.array.controls.filter((e) => !data.find((d) => d['id'] === e['id']));
                if (this.state.array.controls.length === 0) {
                  this.data = undefined;
                  this.useChange.emit();
                }
              })
            )
          );
          start += 10;
        } else {
          const data = array.slice(start, array.length - start);
          combines.push(
            this.service.import(data.map((e) => ({
              ...e.value,
              frequency: parseInt(e.value.frequency, 0) / 365,
              totalSpending: parseInt(e.value.totalSpending, 0),
              totalDeal: parseInt(e.value.totalDeal, 0),
            }))).pipe(
              tap(() => {
                this.toastrService.success('', 'Import ' + (array.length - start) + ' customers successful!', { duration: 3000 });
                count += array.length - 1;
                this.useTextLoading.emit(count + '/' + array.length);
                this.state.array.controls = this.state.array.controls.filter((e) => !data.find((d) => d['id'] === e['id']));
                if (this.state.array.controls.length === 0) {
                  this.data = undefined;
                  this.useChange.emit();
                }
              })
            )
          );
          start = array.length - 1;
        }
      }
      merge(
        ...combines
      ).pipe(
        finalize(() => {
          setTimeout(() => {
            this.useUnLoading.emit();
          }, 1000);
        })
      ).subscribe();
      // this.subscriptions.push(
      //   this.service.import(this.state.array.controls.filter((e) => e.valid).map((e) => ({
      //     ...e.value,
      //     frequency: parseInt(e.value.frequency, 0) / 365,
      //     totalSpending: parseInt(e.value.totalSpending, 0),
      //     totalDeal: parseInt(e.value.totalDeal, 0),
      //   }))).pipe(
      //     tap((data) => {
      //       this.toastrService.success('', 'Import customers successful!', { duration: 3000 });
      //       this.state.array.controls = this.state.array.controls.filter((e) => e.invalid);
      //       if (this.state.array.length === 0) {
      //         this.data = undefined;
      //         this.useChange.emit();
      //       }
      //     }),
      //     catchError((err) => {
      //       this.toastrService.danger('', 'Import customers fail! ' + err.message, { duration: 3000 });
      //       return of(undefined);
      //     }),
      //     finalize(() => {
      //       this.useUnLoading.emit();
      //     })
      //   ).subscribe()
      // );
    } else {
      this.toastrService.warning('', 'No valid customers to import', { duration: 3000 });
    }
  }
  useSelectImage = (event: any, input: HTMLElement, form: FormGroup) => {
    form.get('errorImage').setValue(false);
    const files: File[] = event.target.files;
    if (files.length > 1) {
      form.get('errorImage').setValue(true);
      form.get('errorImageMessage').setValue('Only one image accepted');
      input.nodeValue = undefined;
    } else {
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(files[0].type)) {
        if (files[0].size > 1024 * 1024 * 2) {
          form.get('errorImage').setValue(true);
          form.get('errorImageMessage').setValue('Only image size less than 2MB accept');
          input.nodeValue = undefined;
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            form.get('avatar').setValue(reader.result);
          };
          reader.readAsDataURL(files[0]);
        }
      } else {
        form.get('errorImage').setValue(true);
        form.get('errorImageMessage').setValue('Only one image accepted');
        input.nodeValue = undefined;
      }
    }
  }
  useRemoveItem = (index: number) => {
    this.state.array.removeAt(index);
    if (this.state.array.length === 0) {
      this.data = undefined;
      this.useChange.emit();
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
  useSort = (key: string) => {
    if (this.sortBy.key === key) {
      this.sortBy.stage = this.sortBy.stage === 'up' ? 'down' : 'up';
    } else {
      this.sortBy.key = key;
    }
    console.log('sort');
    this.state.array.controls = this.state.array.controls.sort((a, b) => a[this.sortBy.key] < b[this.sortBy.key] ? (this.sortBy.stage === 'down' ? -1 : 1) : (this.sortBy.stage === 'down' ? 1 : -1));
  }
  useGetCount = (type: 'valid' | 'invalid') => {
    return this.state.array.controls.filter((group) => group[type]).length;
  }
}
