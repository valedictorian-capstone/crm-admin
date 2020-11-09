import { Clipboard } from '@angular/cdk/clipboard';
import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { ActionMenuItem } from '@extras/models';
import { NbDialogRef, NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AccountService, EmailService, MockService, RoleService } from '@services';
import { AccountVM, Province, RoleVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: AccountVM[] = [];
  roles: RoleVM[] = [];
  employeeFilter: AccountVM[] = [];
  min = 0;
  active = 1;
  showSearch = false;
  search = '';
  count = 20;
  env = 'desktop';
  provinces: Province[] = [];
  actions: ActionMenuItem[] = [
    {
      label: 'Get employee phone',
      value: 'phone',
      icon: {
        icon: 'phone-outline',
        status: 'success'
      },
      textColor: 'text-success',
    },
    {
      label: 'Mail to employee',
      value: 'mail',
      icon: {
        icon: 'email-outline',
        status: 'warning'
      },
      textColor: 'text-warning',
    },
    {
      label: 'Edit employee\'s information',
      value: 'edit',
      icon: {
        icon: 'edit-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
    {
      label: 'Disabled employee',
      value: 'remove',
      icon: {
        icon: 'trash-2-outline',
        status: 'danger'
      },
      textColor: 'text-danger',
    }
  ];
  headerActions: ActionMenuItem[] = [
    {
      label: 'Export to excel',
      value: 'export',
      icon: {
        icon: 'cloud-download-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
    {
      label: 'Import excel',
      value: 'import',
      icon: {
        icon: 'cloud-upload-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
  ];
  constructor(
    protected readonly service: AccountService,
    protected readonly emailService: EmailService,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly roleService: RoleService,
    protected readonly mockService: MockService,
    protected readonly dialogService: NbDialogService,
  ) {
    if (deviceService.isMobile()) {
      this.env = 'mobile';
    }
  }

  ngOnInit() {
    this.mockService.getProvinces().subscribe((data) => this.provinces = data);
    this.roleService.findAll().subscribe((data) => {
      this.roles = data;
    });
    this.service.findAll().subscribe((data) => {
      this.employees = data;
      this.search = '';
      this.useFilter();
    });
  }

  useFilter = () => {
    this.employeeFilter = this.employees.filter((employee, i) =>
      (employee.code.toLowerCase().includes(this.search.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.search.toLowerCase()) ||
        employee.fullname.toLowerCase().includes(this.search.toLowerCase()) ||
        employee.phone.toLowerCase().includes(this.search.toLowerCase())) &&
      (i < ((this.min + 1) * this.count) - 1 && i >= this.min * this.count)
    );
  }
  useCreate = (dialog: NbDialogRef<any>, data: AccountVM) => {
    this.employees.push(data);
    this.search = data.fullname;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useUpdate = (dialog: NbDialogRef<any>, data: AccountVM, index: number) => {
    this.employees[index] = data;
    this.search = data.fullname;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useRemove = (data: AccountVM, index: number) => {
    swal.fire({
      showCancelButton: true,
      cancelButtonText: 'Not Sure',
      confirmButtonText: 'Sure',
      title: 'Confirm',
      icon: 'question',
      text: 'Are you sure to disabled ' + data.fullname + ' ?',
    }).then((res) => {
      if (res.isConfirmed) {
        this.service.remove(data.id).subscribe(
          () => {
            this.employees.splice(index, 1);
            this.useFilter();
            swal.fire('Notification', 'Delete ' + data.fullname + ' successfully!!', 'success');
          },
          (error) => {
            swal.fire('Notification', 'Something wrong on runtime! Please check again', 'error');
          }
        );
      }
    });
  }
  usePhone = (phone: string) => {
    console.log(this.env);
    if (this.env === 'desktop') {
      this.clipboard.copy(phone);
      this.toastrService.show('', 'Copy success', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
    } else {
      window.open('tel:' + phone, '_self');
    }
  }
  useShortName = (name: string) => {
    const tmp = name.split(' ');
    if (tmp.length > 0) {
      let rs = '';
      for (let i = 0; i < tmp.length; i++) {
        const element = tmp[i];
        if (i === tmp.length - 1) {
          rs += element;
        } else {
          rs += element.substring(0, 1) + '.';
        }
      }
      return rs;
    } else {
      return name;
    }
  }
  useGo = (index: number) => {
    if (
      this.active !== index
      && index <= this.useMax()
      && index >= 0
    ) {
      if (index > this.min + 3) {
        this.min = this.min + 1;
      } else {
        if (index === this.min) {
          this.min = this.min - 1;
        }
      }
      this.active = index;
    }
  }
  useChangeCount = () => {
    this.search = '';
    this.useFilter();
  }
  useMax = () => {
    return parseInt((this.employeeFilter.length / this.count) + '', 0) + (this.employeeFilter.length % this.count > 0 ? 1 : 0);
  }
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 20 }, { width: 40 }, { width: 40 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 50 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee List');
    XLSX.writeFile(wb, 'employees.xlsx');
  }
  useImport = (event, input) => {
    if (event.target.files[0].name.match(/(.xls|.xlsx)/)) {
      const reader: FileReader = new FileReader();
      reader.onloadend = async () => {
        const bstr: string | ArrayBuffer = reader.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const dataImport: AccountVM[] = XLSX.utils.sheet_to_json(ws);
        input.value = '';
        const rs = dataImport.filter((e) => (e.code && e.phone && e.email && e.fullname)).map((e) => {
          const password = Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
            .map((x) => x[Math.floor(Math.random() * x.length)]).join('');
          return { ...e, password, gender: e.gender ? ((e.gender + '').toLowerCase() === 'female' ? false : true) : undefined };
        });
        if (rs.length === 0) {
          swal.fire('SOMETHING WRONG', 'All field [code, fullname, phone, email] must be fill and must true format and unique! Please try again!', 'warning');
        } else {
          swal.fire({
            showCancelButton: true,
            cancelButtonText: 'Later',
            confirmButtonText: 'Import',
            title: 'Confirm Import',
            icon: 'question',
            text: 'Have ' + rs.length + ' employees true format to import',
          }).then((res) => {
            if (res.isConfirmed) {
              this.service.import(rs as any).subscribe((data) => {
                console.log(data);
                this.employees = this.employees.concat(data);
                console.log(this.employees);
                this.search = '';
                this.useFilter();
                swal.fire('Notification', 'Import ' + rs.length + ' employees successfully!!', 'success');
                for (const e of rs) {
                  const content =
                    '<span>Email: </span> ' + e.email + '<br>' +
                    '<span>Password: </span> ' + e.password;
                  this.emailService.sendMail({
                    info: e as any, subject: 'EMPLOYEE ACCOUNT FOR SYSTEM', content
                  }).toPromise();
                }
              });
            }
          });
        }
      };
      reader.readAsBinaryString(event.target.files[0]);
    } else {
      swal.fire('SOMETHING WRONG', 'Not accept ' + event.target.files[0].name + ' Please try again!', 'error');
    }
  }
  useQuestion = (table: ElementRef<any>, input: any) => {
    swal.fire({
      showCancelButton: true,
      cancelButtonText: 'Get example excel?',
      confirmButtonText: 'Import file excel?',
      title: 'Select',
      icon: 'question',
    }).then((res) => {
      if (res.isConfirmed) {
        input.click();
      }
      if ((res.dismiss as any) === 'cancel') {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
        ws['!cols'] = [{ width: 20 }, { width: 40 }, { width: 40 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 50 }];
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Employee List');
        XLSX.writeFile(wb, 'example-employees.xlsx');
      }
    });
  }
  useAction = (action: ActionMenuItem, template: TemplateRef<any>, mailTemplate: TemplateRef<any>, data: AccountVM, index: number) => {
    switch (action.value) {
      case 'edit':
        this.useDialog(template, 'update-modal');
        return;
      case 'remove':
        this.useRemove(data, index);
        return;
      case 'export':
        this.useExport(template as any);
        return;
      case 'mail':
        this.useDialog(mailTemplate, 'update-modal');
        return;
      case 'phone':
        this.usePhone(data.phone);
        return;
    }
  }
  useDialog(template: TemplateRef<any>, dialogClass: string) {
    this.dialogService.open(template, { dialogClass });
  }
}
