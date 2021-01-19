import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { AccountVM } from '@view-models';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-export',
  templateUrl: './employee-export.component.html',
  styleUrls: ['./employee-export.component.scss']
})
export class EmployeeExportComponent {
  @Input() data: AccountVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Export');
    XLSX.writeFile(wb, 'employee-export-' + new Date().getTime() + '.xlsx');
  }
}
