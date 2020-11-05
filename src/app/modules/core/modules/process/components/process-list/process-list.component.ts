import { Component, ElementRef, OnInit } from '@angular/core';
import { ProcessService } from '@services';
import { ProcessVM } from '@view-models';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.scss']
})
export class ProcessListComponent implements OnInit {
  processs: ProcessVM[] = [];
  processFilter: ProcessVM[] = [];
  min = 0;
  active = 1;
  showSearch = false;
  search = '';
  count = 20;
  constructor(
    protected readonly service: ProcessService,
  ) {

  }

  ngOnInit() {
    this.service.findAll().subscribe((data) => {
      this.processs = data;
      this.search = '';
      this.useFilter();
    });
  }

  useFilter = () => {
    this.processFilter = this.processs.filter((process, i) =>
      (process.name.toLowerCase().includes(this.search.toLowerCase()) || process.code.toLowerCase().includes(this.search.toLowerCase())) &&
      (i < ((this.min + 1) * this.count) - 1 && i >= this.min * this.count)
    );
  }
  useCreate = (data: ProcessVM) => {
    this.processs.push(data);
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
  }
  useUpdate = (data: ProcessVM, index: number) => {
    this.processs[index] = data;
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
  }
  useRemove = (data: ProcessVM) => {
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
            this.processs = this.processs.filter((process) => process.id !== data.id);
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
    return parseInt((this.processFilter.length / this.count) + '', 0) + (this.processFilter.length % this.count > 0 ? 1 : 0);
  }
  export = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 20 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead List');
    XLSX.writeFile(wb, 'processs.xlsx');
  }
}
