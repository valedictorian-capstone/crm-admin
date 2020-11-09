import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { ActionMenuItem } from '@extras/models';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { DepartmentService } from '@services';
import { DepartmentVM } from '@view-models';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  departments: DepartmentVM[] = [];
  departmentFilter: DepartmentVM[] = [];
  min = 0;
  active = 1;
  showSearch = false;
  search = '';
  count = 20;
  actions: ActionMenuItem[] = [
    {
      label: 'Edit department\'s information',
      value: 'edit',
      icon: {
        icon: 'edit-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
    {
      label: 'Disabled department',
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
    protected readonly service: DepartmentService,
    protected readonly dialogService: NbDialogService,
  ) { }
  ngOnInit() {
    this.service.findAll().subscribe((data) => {
      this.departments = data;
      this.search = '';
      this.useFilter();
    });
  }
  useFilter = () => {
    this.departmentFilter = this.departments.filter((department, i) =>
      department.name.toLowerCase().includes(this.search.toLowerCase()) &&
      (i < ((this.min + 1) * this.count) - 1 && i >= this.min * this.count)
    );
  }
  useCreate = (dialog: NbDialogRef<any>, data: DepartmentVM) => {
    this.departments.push(data);
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useUpdate = (dialog: NbDialogRef<any>, data: DepartmentVM, index: number) => {
    this.departments[index] = data;
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useRemove = (data: DepartmentVM, index: number) => {
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
            this.departments.splice(index, 1);
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
    return parseInt((this.departmentFilter.length / this.count) + '', 0) + (this.departmentFilter.length % this.count > 0 ? 1 : 0);
  }
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 20 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead List');
    XLSX.writeFile(wb, 'departments.xlsx');
  }
  useAction = (action: ActionMenuItem, template: TemplateRef<any>, data: DepartmentVM, index: number) => {
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
    }
  }
  useDialog(template: TemplateRef<any>, dialogClass: string) {
    this.dialogService.open(template, { dialogClass });
  }
  useLeader = (department: DepartmentVM) => {
    return department.accountDepartments.filter((e) => e.isLeader);
  }
  useMember = (department: DepartmentVM) => {
    return department.accountDepartments.filter((e) => !e.isLeader);
  }
}
