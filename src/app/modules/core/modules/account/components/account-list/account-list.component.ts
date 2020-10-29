import { Component, ElementRef, OnInit } from '@angular/core';
import { CustomerService, GroupService } from '@services';
import { CustomerVM, GroupVM } from '@view-models';
import swal from 'sweetalert2';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Clipboard } from '@angular/cdk/clipboard';
import * as XLSX from 'xlsx';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {
  accounts: CustomerVM[] = [];
  groups: GroupVM[] = [];
  accountFilter: CustomerVM[] = [];
  min = 0;
  active = 1;
  showSearch = false;
  search = '';
  count = 20;
  env = 'desktop';
  constructor(
    protected readonly service: CustomerService,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly groupService: GroupService,
  ) {
    if (deviceService.isMobile()) {
      this.env = 'mobile';
    }
  }

  ngOnInit() {
    this.groupService.findAll().subscribe((data) => {
      this.groups = data;
    });
    this.service.findAllByType('account').subscribe((data) => {
      this.accounts = data;
      this.search = '';
      this.useFilter();
    });
  }

  useFilter = () => {
    this.accountFilter = this.accounts.filter((account, i) =>
      (account.code.toLowerCase().includes(this.search.toLowerCase()) ||
        account.email.toLowerCase().includes(this.search.toLowerCase()) ||
        account.fullname.toLowerCase().includes(this.search.toLowerCase()) ||
        account.phone.toLowerCase().includes(this.search.toLowerCase())) &&
      (i < ((this.min + 1) * this.count) - 1 && i >= this.min * this.count)
    );
    console.log(this.getMax());
  }
  useCreate = (data: CustomerVM) => {
    this.accounts.push(data);
    this.search = data.code;
    this.showSearch = true;
    this.useFilter();
  }
  useUpdate = (data: CustomerVM, index: number) => {
    this.accounts[index] = data;
    this.search = data.code;
    this.showSearch = true;
    this.useFilter();
  }
  useRemove = (data: CustomerVM) => {
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
            this.accounts = this.accounts.filter((account) => account.id !== data.id);
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
    return parseInt((this.accountFilter.length / this.count) + '', 0) + (this.accountFilter.length % this.count > 0 ? 1 : 0);
  }
  export = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 20 }, { width: 40 }, { width: 40 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 50 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Account List');
    XLSX.writeFile(wb, 'accounts.xlsx');
  }
  import = (event, input) => {
    if (event.target.files[0].name.match(/(.xls|.xlsx)/)) {
      const reader: FileReader = new FileReader();
      reader.onloadend = async () => {
        const bstr: string | ArrayBuffer = reader.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const dataImport: CustomerVM[] = XLSX.utils.sheet_to_json(ws);
        input.value = '';
        const rs = dataImport.filter((e) => (e.code && e.phone && e.email && e.fullname));
        if (rs.length === 0) {
          swal.fire('SOMETHING WRONG', 'All field [code, fullname, phone, email] must be fill and must true format and unique! Please try again!', 'warning');
        } else {
          swal.fire({
            showCancelButton: true,
            cancelButtonText: 'Later',
            confirmButtonText: 'Import',
            title: 'Confirm Import',
            icon: 'question',
            text: 'Have ' + rs.length + ' accounts true format to import',
          }).then((res) => {
            if (res.isConfirmed) {
              this.service.import(rs.map((e) => (
                {
                  ...e, type: 'account',
                  gender: e.gender ? ((e.gender + '').toLowerCase() === 'female' ? false : true) : undefined
                }
              ))).subscribe((data) => {
                this.accounts = this.accounts.concat(data);
                this.search = '';
                this.useFilter();
                swal.fire('Notification', 'Import ' + rs.length + ' accounts successfully!!', 'success');
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
        XLSX.utils.book_append_sheet(wb, ws, 'Account List');
        XLSX.writeFile(wb, 'example-accounts.xlsx');
      }
    });
  }
  useChangeType = (data: CustomerVM, type: string) => {
    swal.fire({
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Change',
      title: 'Confirm change customer type',
      icon: 'question',
    }).then((res) => {
      if (res.isConfirmed) {
        this.service.update({ ...data, type }).subscribe(() => {
          this.accounts = this.accounts.filter((account) => account.id !== data.id);
          this.useFilter();
          swal.fire('Notification', 'Change successfully!', 'success');
        });
      }
      if ((res.dismiss as any) === 'cancel') {
        this.useFilter();
        console.log(this.accountFilter);
      }
    });
  }
}
