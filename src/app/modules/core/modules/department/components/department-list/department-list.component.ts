import { Component, ElementRef, OnInit } from '@angular/core';
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
  constructor(
    protected readonly service: DepartmentService,
  ) {

  }

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
  useCreate = (data: DepartmentVM) => {
    this.departments.push(data);
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
  }
  useUpdate = (data: DepartmentVM, index: number) => {
    this.departments[index] = data;
    this.search = data.name;
    this.showSearch = true;
    this.useFilter();
  }
  useRemove = (data: DepartmentVM) => {
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
            this.departments = this.departments.filter((department) => department.id !== data.id);
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
    return parseInt((this.departmentFilter.length / this.count) + '', 0) + (this.departmentFilter.length % this.count > 0 ? 1 : 0);
  }
  export = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 20 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead List');
    XLSX.writeFile(wb, 'departments.xlsx');
  }
}
