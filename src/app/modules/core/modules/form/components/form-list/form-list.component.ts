import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { ActionMenuItem } from '@extras/models';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { FormGroupService } from '@services';
import { FormGroupVM } from '@view-models';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-form-group-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {
  forms: FormGroupVM[] = [];
  formFilter: FormGroupVM[] = [];
  min = 0;
  active = 1;
  showSearch = false;
  search = '';
  count = 20;
  actions: ActionMenuItem[] = [
    {
      label: 'Edit form\'s information',
      value: 'edit',
      icon: {
        icon: 'edit-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
    {
      label: 'Disabled form',
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
    protected readonly service: FormGroupService,
    protected readonly dialogService: NbDialogService,
  ) { }
  ngOnInit() {
    this.service.findAll().subscribe((data) => {
      this.forms = data;
      this.search = '';
      this.useFilter();
    });
  }
  useFilter = () => {
    this.formFilter = this.forms.filter((form, i) =>
      form.name.toLowerCase().includes(this.search.toLowerCase()) &&
      (i < ((this.min + 1) * this.count) - 1 && i >= this.min * this.count)
    );
  }
  useCreate = (dialog: NbDialogRef<any>, data: FormGroupVM) => {
    this.forms.push(data);
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useUpdate = (dialog: NbDialogRef<any>, data: FormGroupVM, index: number) => {
    this.forms[index] = data;
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useRemove = (data: FormGroupVM, index: number) => {
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
            this.forms.splice(index, 1);
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
    return parseInt((this.formFilter.length / this.count) + '', 0) + (this.formFilter.length % this.count > 0 ? 1 : 0);
  }
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 20 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead List');
    XLSX.writeFile(wb, 'forms.xlsx');
  }
  useAction = (action: ActionMenuItem, template: TemplateRef<any>, data: FormGroupVM, index: number) => {
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
}
