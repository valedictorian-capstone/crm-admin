import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { ActionMenuItem } from '@extras/models';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { ProcessService } from '@services';
import { ProcessVM } from '@view-models';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss']
})
export class ConfigListComponent implements OnInit {
  processs: ProcessVM[] = [];
  processFilter: ProcessVM[] = [];
  min = 0;
  active = 1;
  showSearch = false;
  search = '';
  count = 20;
  actions: ActionMenuItem[] = [
    {
      label: 'Edit process\'s information',
      value: 'edit',
      icon: {
        icon: 'edit-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
    {
      label: 'Manage process\'s step',
      value: 'step',
      icon: {
        icon: 'rewind-right-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
    {
      label: 'Manage process\'s instance',
      value: 'instance',
      icon: {
        icon: 'sync-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
    {
      label: 'Disabled process',
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
  ];
  constructor(
    protected readonly service: ProcessService,
    protected readonly dialogService: NbDialogService,
    protected readonly router: Router
  ) { }
  ngOnInit() {
    this.service.findAll().subscribe((data) => {
      this.processs = data;
      this.search = '';
      this.useFilter();
    });
  }
  useFilter = () => {
    this.processFilter = this.processs.filter((process, i) =>
      process.name.toLowerCase().includes(this.search.toLowerCase()) &&
      (i < ((this.min + 1) * this.count) - 1 && i >= this.min * this.count)
    );
  }
  useCreate = (dialog: NbDialogRef<any>, data: ProcessVM) => {
    this.processs.push(data);
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useUpdate = (dialog: NbDialogRef<any>, data: ProcessVM, index: number) => {
    this.processs[index] = data;
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useRemove = (data: ProcessVM, index: number) => {
    swal.fire({
      showCancelButton: true,
      cancelButtonText: 'Not Sure',
      confirmButtonText: 'Sure',
      title: 'Confirm',
      icon: 'question',
      text: 'Are you sure to disabled ' + data.name + ' ?',
    }).then((res) => {
      if (res.isConfirmed) {
        this.service.remove(data.id).subscribe(
          () => {
            this.processs.splice(index, 1);
            this.useFilter();
            swal.fire('Notification', 'Delete ' + data.name + ' successfully!!', 'success');
          },
          (error) => {
            swal.fire('Notification', 'Something wrong on runtime! Please check again', 'error');
          }
        );
      }
    });
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
    return parseInt((this.processFilter.length / this.count) + '', 0) + (this.processFilter.length % this.count > 0 ? 1 : 0);
  }
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 20 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead List');
    XLSX.writeFile(wb, 'processs.xlsx');
  }
  useAction = (action: ActionMenuItem, template: TemplateRef<any>, data: ProcessVM, index: number) => {
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
      case 'step':
        this.router.navigate(['core/process/' + data.id + '/step']);
        return;
      case 'instance':
        this.router.navigate(['core/process/' + data.id + '/instance']);
        return;
    }
  }
  useDialog(template: TemplateRef<any>, dialogClass: string) {
    this.dialogService.open(template, { dialogClass });
  }
  useStep = (process: ProcessVM, type: string, subType: string) => {
    return process.processSteps.filter((e) => e.type === type && e.subType === subType);
  }
}
