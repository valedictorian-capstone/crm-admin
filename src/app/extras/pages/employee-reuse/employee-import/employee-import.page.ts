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
  employees: FormArray = new FormArray([]);
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
          password: new FormControl(Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
          .map((x) => x[Math.floor(Math.random() * x.length)]).join('')),
          phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
          phoneStage: new FormControl('done'),
          emailStage: new FormControl('done'),
          codeStage: new FormControl('done'),
          showBirthday: new FormControl(false),
          errorImage: new FormControl(false),
          errorImageMessage: new FormControl(''),
          email: new FormControl('', [Validators.required, Validators.email]),
          fullname: new FormControl(undefined, [Validators.required]),
          code: new FormControl(undefined, [Validators.required]),
          avatar: new FormControl(undefined),
          roles: new FormControl([], [Validators.required]),
        });
        const elements = [];
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const element = item[key];
            elements.push(element);
            if (group.get(key)) {
              group.get(key).setValue(element);
              group.get(key).markAsTouched();
            }
          }
        }
        (group as any).autoCompleteData = elements;
        this.employees.push(group);
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
        this.toastrService.success('', 'Import accounts successful!', { duration: 3000 });
        this.useChange.emit();
      }, (err) => {
        this.toastrService.danger('', 'Import accounts fail! Something wrong at runtime', { duration: 3000 });
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
    const phone = form.get('phone');
    if (phone.valid) {
      form.get('phoneStage').setValue('querying');
      setTimeout(async () => {
        const check = await this.employeeService.checkUnique('phone', phone.value).toPromise();
        if (phone.valid && check) {
          phone.setErrors({ duplicate: true });
        }
        form.get('phoneStage').setValue('done');
      }, 1000);
    }

  }
  useCheckEmail = (form: FormGroup) => {
    const email = form.get('email');
    if (email.valid) {
      form.get('emailStage').setValue('querying');
      setTimeout(async () => {
        const check = await this.employeeService.checkUnique('email', email.value).toPromise();
        if (email.valid && check) {
          email.setErrors({ duplicate: true });
        }
        form.get('emailStage').setValue('done');
      }, 1000);
    }
  }
  useCheckCode = (form: FormGroup) => {
    const code = form.get('code');
    if (code.valid) {
      form.get('codeStage').setValue('querying');
      setTimeout(async () => {
        const check = await this.employeeService.checkUnique('code', code.value).toPromise();
        if (code.valid && check) {
          code.setErrors({ duplicate: true });
        }
        form.get('codeStage').setValue('done');
      }, 1000);
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
    this.employees.removeAt(index);
    if (this.employees.length === 0) {
      this.data = undefined;
      this.useChange.emit();
    }
  }
}
