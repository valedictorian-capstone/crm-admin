import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionMenuItem } from '@extras/models';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { DepartmentService, ProcessService, ProcessStepService } from '@services';
import { DepartmentVM, ProcessStepVM, ProcessVM } from '@view-models';
import { pluck, switchMap } from 'rxjs/operators';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-step-list',
  templateUrl: './step-list.component.html',
  styleUrls: ['./step-list.component.scss']
})
export class StepListComponent implements OnInit {
  process: ProcessVM;
  steps: ProcessStepVM[] = [];
  stepFilter: ProcessStepVM[] = [];
  min = 0;
  active = 1;
  showSearch = false;
  search = '';
  count = 20;
  departments: DepartmentVM[] = [];
  actions: ActionMenuItem[] = [
    {
      label: 'Edit step\'s information',
      value: 'edit',
      icon: {
        icon: 'edit-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
    {
      label: 'Disabled step',
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
  icons = [
    {
      name: 'activity-task',
      value: 'bpmn-icon-call-activity'
    },
    {
      name: 'gateway-parallel',
      value: 'bpmn-icon-gateway-parallel'
    },
    {
      name: 'gateway-exclusive',
      value: 'bpmn-icon-gateway-xor'
    },
    {
      name: 'gateway-inclusive',
      value: 'bpmn-icon-gateway-or'
    },
    {
      name: 'event-start',
      value: 'bpmn-icon-start-event-none'
    },
    {
      name: 'event-end',
      value: 'bpmn-icon-end-event-none'
    },
  ];
  constructor(
    protected readonly service: ProcessStepService,
    protected readonly processService: ProcessService,
    protected readonly dialogService: NbDialogService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly departmentService: DepartmentService,
  ) {
    this.activatedRoute.params.pipe(
      pluck('id'),
      switchMap((id) => this.processService.findById(id))
    ).subscribe((data) => {
      this.process = data;
      this.steps = data.processSteps;
      this.search = '';
      this.useFilter();
    });
  }
  ngOnInit() {
    this.departmentService.findAll().subscribe((data) => this.departments = data);
  }
  useFilter = () => {
    this.stepFilter = this.steps.filter((step, i) =>
      step.name.toLowerCase().includes(this.search.toLowerCase()) &&
      (i < ((this.min + 1) * this.count) - 1 && i >= this.min * this.count)
    );
  }
  useCreate = (dialog: NbDialogRef<any>, data: ProcessStepVM) => {
    this.steps.push(data);
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useUpdate = (dialog: NbDialogRef<any>, data: ProcessStepVM, index: number) => {
    this.steps[index] = data;
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
    dialog.close();
  }
  useRemove = (data: ProcessStepVM, index: number) => {
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
            this.steps.splice(index, 1);
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
    return parseInt((this.stepFilter.length / this.count) + '', 0) + (this.stepFilter.length % this.count > 0 ? 1 : 0);
  }
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 20 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead List');
    XLSX.writeFile(wb, 'steps.xlsx');
  }
  useAction = (action: ActionMenuItem, template: TemplateRef<any>, data: ProcessStepVM, index: number) => {
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
  useIcon = (data: string) => {
    return this.icons.find((icon) => icon.name === data);
  }
}
