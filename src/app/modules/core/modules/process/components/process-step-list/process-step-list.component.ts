import { Component, ElementRef, OnInit } from '@angular/core';
import { DepartmentService, ProcessService, ProcessStepService } from '@services';
import { DepartmentVM, ProcessStepVM, ProcessVM } from '@view-models';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { pluck, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-process-step-list',
  templateUrl: './process-step-list.component.html',
  styleUrls: ['./process-step-list.component.scss']
})
export class ProcessStepListComponent implements OnInit {
  process: ProcessVM;
  processSteps: ProcessStepVM[] = [];
  processStepFilter: ProcessStepVM[] = [];
  min = 0;
  active = 1;
  showSearch = false;
  search = '';
  count = 20;
  departments: DepartmentVM[] = [];
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
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly processService: ProcessService,
    protected readonly departmentService: DepartmentService,
  ) {
    this.activatedRoute.params.pipe(
      pluck('id'),
      switchMap((id) => this.processService.findById(id))
    ).subscribe((data) => {
      this.process = data;
      this.processSteps = data.processSteps;
      this.search = '';
      this.useFilter();
    });
  }

  ngOnInit() {
    this.departmentService.findAll().subscribe((data) => this.departments = data);
  }

  useFilter = () => {
    this.processStepFilter = this.processSteps.filter((processStep, i) =>
      processStep.name.toLowerCase().includes(this.search.toLowerCase()) &&
      (i < ((this.min + 1) * this.count) - 1 && i >= this.min * this.count)
    );
  }
  useCreate = (data: ProcessStepVM) => {
    this.processSteps.push(data);
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
  }
  useUpdate = (data: ProcessStepVM, index: number) => {
    this.processSteps[index] = data;
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
  }
  useRemove = (data: ProcessStepVM) => {
    swal.fire({
      showCancelButton: true,
      cancelButtonText: 'Not Sure',
      confirmButtonText: 'Sure',
      title: 'Confirm',
      icon: 'question',
      text: 'Are you sure to shutdown ' + data.name + ' ?',
    }).then((res) => {
      if (res.isConfirmed) {
        this.service.remove(data.id).subscribe(
          () => {
            this.processSteps = this.processSteps.filter((processStep) => processStep.id !== data.id);
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
    return parseInt((this.processStepFilter.length / this.count) + '', 0) + (this.processStepFilter.length % this.count > 0 ? 1 : 0);
  }
  export = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 20 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead List');
    XLSX.writeFile(wb, 'processSteps.xlsx');
  }
  getIcon = (data: string) => {
    return this.icons.find((icon) => icon.name === data);
  }
}
