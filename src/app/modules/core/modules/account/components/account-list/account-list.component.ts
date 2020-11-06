import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { CustomerService, GroupService, MockService } from '@services';
import { CustomerVM, GroupVM, Province } from '@view-models';
import swal from 'sweetalert2';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Clipboard } from '@angular/cdk/clipboard';
import * as XLSX from 'xlsx';
import { NbDialogRef, NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ActionMenuItem } from '@extras/models';
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
  provinces: Province[] = [];
  actions: ActionMenuItem[] = [
    {
      label: 'Get account phone',
      value: 'phone',
      icon: {
        icon: 'phone-outline',
        status: 'success'
      },
      textColor: 'text-success',
    },
    {
      label: 'Mail to account',
      value: 'mail',
      icon: {
        icon: 'email-outline',
        status: 'warning'
      },
      textColor: 'text-warning',
    },
    {
      label: 'Edit account\'s information',
      value: 'edit',
      icon: {
        icon: 'edit-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
    {
      label: 'Disabled account',
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
    protected readonly service: CustomerService,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly groupService: GroupService,
    protected readonly mockService: MockService,
    protected readonly dialogService: NbDialogService,
  ) {
    if (deviceService.isMobile()) {
      this.env = 'mobile';
    }
  }

  ngOnInit() {
    this.mockService.getProvinces().subscribe((data) => this.provinces = data);
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
  }
  useCreate = (dialog: NbDialogRef<any>, data: CustomerVM) => {
    this.accounts.push(data);
    this.search = data.fullname;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useUpdate = (dialog: NbDialogRef<any>, data: CustomerVM, index: number) => {
    this.accounts[index] = data;
    this.search = data.fullname;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useRemove = (data: CustomerVM, index: number) => {
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
            this.accounts.splice(index, 1);
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
    return parseInt((this.accountFilter.length / this.count) + '', 0) + (this.accountFilter.length % this.count > 0 ? 1 : 0);
  }
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 20 }, { width: 40 }, { width: 40 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 50 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Account List');
    XLSX.writeFile(wb, 'accounts.xlsx');
  }
  useImport = (event, input) => {
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
  useAction = (action: ActionMenuItem, template: TemplateRef<any>, mailTemplate: TemplateRef<any>, data: CustomerVM, index: number) => {
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
