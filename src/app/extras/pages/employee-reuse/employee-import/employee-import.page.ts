import { Component, OnInit, Input, ElementRef, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService, RoleService } from '@services';
import { AccountVM, RoleVM } from '@view-models';
import * as XLSX from 'xlsx';
import { finalize } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-employee-import',
  templateUrl: './employee-import.page.html',
  styleUrls: ['./employee-import.page.scss']
})
export class EmployeeImportPage implements OnInit, OnChanges {
  @Input() data: AccountVM[];
  @Output() useChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() useLoading: EventEmitter<any> = new EventEmitter<any>();
  @Output() useUnLoading: EventEmitter<any> = new EventEmitter<any>();
  employees: FormArray = new FormArray([
    new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fullname: new FormControl(undefined, [Validators.required]),
      code: new FormControl(undefined, [Validators.required]),
      roles: new FormControl([], [Validators.required]),
    })
  ]);
  roles: RoleVM[] = [];
  constructor(
    protected readonly employeeService: AccountService,
    protected readonly toastrService: NbToastrService,
    protected readonly roleService: RoleService,
  ) { }

  ngOnInit() {
    this.roleService.findAll().subscribe((data) => {
      this.roles = data;
    });
  }
  ngOnChanges() {
    if (this.data) {
      this.employees.clear();
      for (const item of this.data) {
        const group = new FormGroup({
          phone: new FormControl('',
            [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
          password: new FormControl(Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
          .map((x) => x[Math.floor(Math.random() * x.length)]).join('')),
          email: new FormControl('', [Validators.required, Validators.email]),
          fullname: new FormControl(undefined, [Validators.required]),
          code: new FormControl(undefined, [Validators.required]),
          roles: new FormControl([], [Validators.required]),
        });
        const elements = [];
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const element = item[key];
            elements.push(element);
            if (group.get(key)) {
              group.get(key).setValue(element);
            }
          }
        }
        (group as any).autoCompleteData = elements;
        this.useCheckEmail(group);
        this.useCheckCode(group);
        this.useCheckPhone(group);
        this.employees.controls.push(group);
      }
    }
  }
  useImport = () => {
    if (this.employees.valid) {
      this.useLoading.emit();
      this.employeeService.import(this.employees.controls.map((e) => e.value)).pipe(
        finalize(() => {
          this.useUnLoading.emit();
        })
      ).subscribe((data) => {
        data.forEach((e) => this.employeeService.triggerValue$.next({ type: 'create', data: e }));
        this.toastrService.success('', 'Import employees success!', { duration: 3000 });
        this.useChange.emit();
      }, (err) => {
        this.toastrService.danger('', 'Import employees fail! Something wrong at runtime', { duration: 3000 });
      });
    }
  }
  useDownload = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Example Import');
    XLSX.writeFile(wb, 'employee-example' + new Date().getTime() + '.xlsx');
  }
  useCheckPhone = (form: FormGroup) => {
    if (form.get('phone').value) {
      (form as any).phoneStage = 'querying';
      setTimeout(async () => {
        const phone = form.get('phone');
        const check = await this.employeeService.checkUnique('phone', phone.value).toPromise();
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
        const check = await this.employeeService.checkUnique('email', email.value).toPromise();
        if (email.valid && check) {
          email.setErrors({ duplicate: true });
        }
        (form as any).emailStage = 'done';
      }, 1000);
    }
  }
  useCheckCode = (form: FormGroup) => {
    if (form.get('code').value) {
      (form as any).codeStage = 'querying';
      setTimeout(async () => {
        const code = form.get('code');
        const check = await this.employeeService.checkUnique('code', code.value).toPromise();
        if (code.valid && check) {
          code.setErrors({ duplicate: true });
        }
        (form as any).codeStage = 'done';
      }, 1000);
    }
  }
}
