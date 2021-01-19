import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { LogVM } from '@view-models';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-log-export',
  templateUrl: './log-export.component.html',
  styleUrls: ['./log-export.component.scss']
})
export class LogExportComponent {
  @Input() data: LogVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Log Export');
    XLSX.writeFile(wb, 'log-export-' + new Date().getTime() + '.xlsx');
  }
}
