import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionMenuItem } from '@extras/models';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { CustomerService, ProcessInstanceService, ProcessService } from '@services';
import { CustomerVM, ProcessInstanceVM, ProcessVM } from '@view-models';
import { pluck, switchMap } from 'rxjs/operators';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-instance-list',
  templateUrl: './instance-list.component.html',
  styleUrls: ['./instance-list.component.scss']
})
export class InstanceListComponent implements OnInit {
  customers: CustomerVM[] = [];
  process: ProcessVM;
  instances: ProcessInstanceVM[] = [];
  instanceFilter: ProcessInstanceVM[] = [];
  min = 0;
  active = 1;
  showSearch = false;
  search = '';
  count = 20;
  actions: ActionMenuItem[] = [
    {
      label: 'Edit instance\'s information',
      value: 'edit',
      icon: {
        icon: 'edit-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
    {
      label: 'Canceled instance',
      value: 'cancel',
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
    protected readonly service: ProcessInstanceService,
    protected readonly processService: ProcessService,
    protected readonly dialogService: NbDialogService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly customerService: CustomerService,
    protected readonly router: Router,
  ) {
    this.activatedRoute.params.pipe(
      pluck('id'),
      switchMap((id) => this.processService.findById(id))
    ).subscribe((data) => {
      this.process = data;
      this.instances = data.processInstances;
      this.search = '';
      this.useFilter();
    });
  }
  ngOnInit() {
    this.customerService.findAll().subscribe((data) => this.customers = data);
  }
  useFilter = () => {
    this.instanceFilter = this.instances.filter((instance, i) =>
      instance.code.toLowerCase().includes(this.search.toLowerCase()) &&
      (i < ((this.min + 1) * this.count) - 1 && i >= this.min * this.count)
    );
  }
  useCreate = (dialog: NbDialogRef<any>, data: ProcessInstanceVM) => {
    this.instances.push(data);
    this.search = data.code;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useUpdate = (dialog: NbDialogRef<any>, data: ProcessInstanceVM, index: number) => {
    this.instances[index] = data;
    this.search = data.code;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useRemove = (data: ProcessInstanceVM, index: number) => {
    swal.fire({
      showCancelButton: true,
      cancelButtonText: 'Not Sure',
      confirmButtonText: 'Sure',
      title: 'Confirm',
      icon: 'question',
      text: 'Are you sure to disabled ' + data.code + ' ?',
    }).then((res) => {
      if (res.isConfirmed) {
        this.service.remove(data.id).subscribe(
          () => {
            this.instances.splice(index, 1);
            this.useFilter();
            swal.fire('Notification', 'Disabled ' + data.code + ' successfully!!', 'success');
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
    return parseInt((this.instanceFilter.length / this.count) + '', 0) + (this.instanceFilter.length % this.count > 0 ? 1 : 0);
  }
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 20 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead List');
    XLSX.writeFile(wb, 'instances.xlsx');
  }
  useAction = (action: ActionMenuItem, template: TemplateRef<any>, data: ProcessInstanceVM, index: number) => {
    switch (action.value) {
      case 'edit':
        this.router.navigate(['core/instance/' + data.id]);
        return;
      case 'cancel':
        this.useRemove(data, index);
        return;
      case 'export':
        this.useExport(template as any);
        return;
    }
  }
  useDialog(template: TemplateRef<any>, dialogClass: string) {
    this.dialogService.open(template, { dialogClass });
  }
}
