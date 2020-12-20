import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { CustomerService } from '@services';
import { CustomerVM } from '@view-models';
import { Subscription, of } from 'rxjs';
import { finalize, tap, catchError } from 'rxjs/operators';
import * as XLSX from 'xlsx';
interface ICustomerImportPageState {
  formArray: FormArray;
}
@Component({
  selector: 'app-customer-import',
  templateUrl: './customer-import.page.html',
  styleUrls: ['./customer-import.page.scss'],
})
export class CustomerImportPage implements OnChanges, AfterViewInit, OnDestroy {
  @Input() data: CustomerVM[];
  @Output() useChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() useLoading: EventEmitter<any> = new EventEmitter<any>();
  @Output() useUnLoading: EventEmitter<any> = new EventEmitter<any>();
  subscriptions: Subscription[] = [];
  state: ICustomerImportPageState = {
    formArray: new FormArray([])
  };
  constructor(
    protected readonly service: CustomerService,
    protected readonly toastrService: NbToastrService,
    protected readonly cdr: ChangeDetectorRef
  ) { }
  ngOnChanges() {
    if (this.data) {
      this.state.formArray.clear();
      for (const item of this.data) {
        const group = new FormGroup({
          phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
          email: new FormControl('', [Validators.required, Validators.email]),
          fullname: new FormControl(undefined, [Validators.required]),
          birthDay: new FormControl(''),
          avatar: new FormControl(undefined),
          gender: new FormControl('-1'),
          phoneStage: new FormControl('done'),
          emailStage: new FormControl('done'),
          showBirthday: new FormControl(false),
          errorImage: new FormControl(false),
          errorImageMessage: new FormControl(''),
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
        const elements = [];
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const element = item[key];
            elements.push(element);
            if (group.get(key)) {
              if (key === 'birthDay') {
                group.get(key).setValue(new Date((element - (25567 + 2)) * 86400 * 1000));
                console.log(group.get(key).value);
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
              } else if (key === 'type') {
                switch (element.toLowerCase()) {
                  case 'personal':
                    group.get(key).setValue('personal');
                    break;
                  case 'company':
                    group.get(key).setValue('company');
                    break;
                  case 'organization':
                    group.get(key).setValue('company');
                    break;
                  default:
                    group.get(key).setValue('personal');
                    break;
                }
              } else {
                group.get(key).setValue(element);
              }
              group.get(key).markAsTouched();
            }
          }
        }
        this.state.formArray.push(group);
      }
      console.log(this.state.formArray);
      this.state.formArray.markAsTouched();
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
    if (this.state.formArray.valid) {
      this.useLoading.emit();
      this.subscriptions.push(
        this.service.import(this.state.formArray.controls.map((e) => ({
          ...e.value,
          frequency: parseInt(e.value.frequency, 0),
          totalSpending: parseInt(e.value.totalSpending, 0),
          totalDeal: parseInt(e.value.totalDeal, 0),
        }))).pipe(
          tap((data) => {
            this.toastrService.success('', 'Import formArray successful!', { duration: 3000 });
            this.useChange.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Import formArray fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useUnLoading.emit();
          })
        ).subscribe()
      );
    }
  }
  useCheckPhone = (form: FormGroup) => {
    const phone = form.get('phone');
    if (phone.valid) {
      form.get('phoneStage').setValue('querying');
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
                form.get('phoneStage').setValue('done');
              }, 1000);
            })
          ).subscribe()
      );
    }

  }
  useCheckEmail = (form: FormGroup) => {
    const email = form.get('email');
    if (email.valid) {
      form.get('emailStage').setValue('querying');
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
                form.get('emailStage').setValue('done');
              }, 1000);
            })
          ).subscribe()
      );
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
        if (files[0].size > 1024 * 1024 * 18) {
          form.get('errorImage').setValue(true);
          form.get('errorImageMessage').setValue('Only image size less than 18MB accept');
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
    this.state.formArray.removeAt(index);
    if (this.state.formArray.length === 0) {
      this.data = undefined;
      this.useChange.emit();
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
