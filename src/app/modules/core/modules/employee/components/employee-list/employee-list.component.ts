import { Component, ElementRef, OnInit } from '@angular/core';
import { AccountService, EmailService, RoleService } from '@services';
import { AccountVM, RoleVM } from '@view-models';
import swal from 'sweetalert2';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Clipboard } from '@angular/cdk/clipboard';
import * as XLSX from 'xlsx';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
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
  constructor(
    protected readonly service: AccountService,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly roleService: RoleService,
    protected readonly emailService: EmailService,
  ) {
    if (deviceService.isMobile()) {
      this.env = 'mobile';
    }
  }

  ngOnInit() {
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
    console.log(this.getMax());
  }
  useCreate = (data: AccountVM) => {
    this.employees.push(data);
    this.search = data.code;
    this.showSearch = true;
    this.useFilter();
  }
  useUpdate = (data: AccountVM, index: number) => {
    this.employees[index] = data;
    this.search = data.code;
    this.showSearch = true;
    this.useFilter();
  }
  useRemove = (data: AccountVM) => {
    swal.fire({
      showCancelButton: true,
      cancelButtonText: 'Not Sure',
      confirmButtonText: 'Sure',
      title: 'Confirm',
      icon: 'question',
      text: 'Are you sure to shutdown ' + data.code + ' ?',
    }).then((res) => {
      if (res.isConfirmed) {
        this.service.remove(data.id).subscribe(
          () => {
            this.employees = this.employees.filter((employee) => employee.id !== data.id);
            this.useFilter();
            swal.fire('Notification', 'Delete ' + data.code + ' successfully!!', 'success');
          },
          (error) => {
            swal.fire('Notification', 'Something wrong on runtime! Please check again', 'error');
          }
        );
      }
    });
  }
  copyPhone = (phone: string) => {
    console.log(this.env);
    if (this.env === 'desktop') {
      this.clipboard.copy(phone);
      this.toastrService.show('', 'Copy success', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
    } else {
      window.open('tel:' + phone, '_self');
    }
  }
  getShortName = (name: string) => {
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
  goto = (index: number) => {
    if (
      this.active !== index
      && index <= this.getMax()
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
  getMax = () => {
    return parseInt((this.employeeFilter.length / this.count) + '', 0) + (this.employeeFilter.length % this.count > 0 ? 1 : 0);
  }
  export = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 20 }, { width: 40 }, { width: 40 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 50 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee List');
    XLSX.writeFile(wb, 'employees.xlsx');
  }
  import = (event, input) => {
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

  useExport = (table: ElementRef<any>, input: any) => {
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
  useChangeType = (data: AccountVM, type: string) => {
    swal.fire({
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Change',
      title: 'Confirm change customer type',
      icon: 'question',
    }).then((res) => {
      if (res.isConfirmed) {
        this.service.update({ ...data, password: undefined }).subscribe(() => {
          this.employees = this.employees.filter((employee) => employee.id !== data.id);
          this.useFilter();
          swal.fire('Notification', 'Change successfully!', 'success');
        });
      }
      if ((res.dismiss as any) === 'cancel') {
        this.useFilter();
        console.log(this.employeeFilter);
      }
    });
  }
}
