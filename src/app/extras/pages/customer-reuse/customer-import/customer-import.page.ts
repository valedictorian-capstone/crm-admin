import { Component, Input, OnInit, ElementRef, OnChanges, EventEmitter, Output } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerVM } from '@view-models';
import { CustomerService } from '@services';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-customer-import',
  templateUrl: './customer-import.page.html',
  styleUrls: ['./customer-import.page.scss'],
  providers: [DatePipe],
})
export class CustomerImportPage implements OnInit, OnChanges {
  @Input() data: CustomerVM[];
  @Output() useChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() useLoading: EventEmitter<any> = new EventEmitter<any>();
  @Output() useUnLoading: EventEmitter<any> = new EventEmitter<any>();
  customers: FormArray = new FormArray([
    new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fullname: new FormControl(undefined, [Validators.required]),
      birthDay: new FormControl(''),
      gender: new FormControl('-1'),
      source: new FormControl('import'),
      type: new FormControl('personal', [Validators.required]),
      frequency: new FormControl(undefined, [Validators.required]),
      totalSpending: new FormControl(undefined, [Validators.required]),
      totalDeal: new FormControl(undefined, [Validators.required]),
      company: new FormControl(''),
      fax: new FormControl(''),
      website: new FormControl(''),
      skypeName: new FormControl(''),
      facebook: new FormControl(''),
      twitter: new FormControl(''),

      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
    })
  ]);
  constructor(
    protected readonly customerService: CustomerService,
    protected readonly datePipe: DatePipe,
    protected readonly toastrService: NbToastrService,
  ) { }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.data) {
      this.customers.clear();
      for (const item of this.data) {
        const group = new FormGroup({
          phone: new FormControl('',
            [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
          email: new FormControl('', [Validators.required, Validators.email]),
          fullname: new FormControl(undefined, [Validators.required]),
          birthDay: new FormControl(''),
          gender: new FormControl('-1'),
          type: new FormControl('personal', [Validators.required]),
          frequency: new FormControl(undefined, [Validators.required]),
          totalSpending: new FormControl(undefined, [Validators.required]),
          totalDeal: new FormControl(undefined, [Validators.required]),
          company: new FormControl(''),
          fax: new FormControl(''),
          website: new FormControl(''),
          skypeName: new FormControl(''),
          facebook: new FormControl(''),
          twitter: new FormControl(''),
          street: new FormControl(''),
          city: new FormControl(''),
          state: new FormControl(''),
          country: new FormControl(''),
        });
        const elements = [];
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const element = item[key];
            elements.push(element);
            if (group.get(key)) {
              if (key === 'birthDay') {
                group.get(key).setValue(new Date((element - (25567 + 2)) * 86400 * 1000));
                console.log(new Date((element - (25567 + 2)) * 86400 * 1000));
                console.log(group.get(key));

              } else if (key === 'gender') {
                switch (element.toLowerCase()) {
                  case 'male':
                    group.get(key).setValue('0');
                    break;
                  case 'female':
                    group.get(key).setValue('1');
                    break;
                  case 'orther':
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
                    group.get(key).setValue(undefined);
                    break;
                }
              } else {
                group.get(key).setValue(element);
              }
            }
          }
        }
        (group as any).autoCompleteData = elements;
        this.useCheckEmail(group);
        this.useCheckPhone(group);
        this.customers.controls.push(group);
      }
    }
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
    if (this.customers.valid) {
      this.useLoading.emit();
      this.customerService.import(this.customers.controls.map((e) => ({
        ...e.value,
        frequency: parseInt(e.value.frequency, 0),
        totalSpending: parseInt(e.value.totalSpending, 0),
        totalDeal: parseInt(e.value.totalDeal, 0),
      }))).pipe(
        finalize(() => {
          this.useUnLoading.emit();
        })
      ).subscribe((data) => {
        data.forEach((e) => this.customerService.triggerValue$.next({ type: 'create', data: e }));
        this.toastrService.success('', 'Import customers success!', { duration: 3000 });
        this.useChange.emit();
      }, (err) => {
        this.toastrService.danger('', 'Import customers fail! Something wrong at runtime', { duration: 3000 });
      });
    }
  }
  useCheckPhone = (form: FormGroup) => {
    if (form.get('phone').value) {
      (form as any).phoneStage = 'querying';
      setTimeout(async () => {
        const phone = form.get('phone');
        const check = await this.customerService.checkUnique('phone', phone.value).toPromise();
        if (phone.valid && check) {
          phone.setErrors({ duplicate: true });
        }
        (form as any).phoneStage = 'done';
      }, 1000);
    }

  }
  useCheckEmail = (form: FormGroup) => {
    if (form.get('email').value) {
      (form as any).emailStage = 'querying';
      setTimeout(async () => {
        const email = form.get('email');
        const check = await this.customerService.checkUnique('email', email.value).toPromise();
        if (email.valid && check) {
          email.setErrors({ duplicate: true });
        }
        (form as any).emailStage = 'done';
      }, 1000);
    }
  }
  toDateFormat = (date: Date) => {
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy') : '';
  }
}
