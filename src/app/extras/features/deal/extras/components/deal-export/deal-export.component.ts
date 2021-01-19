import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { DealVM } from '@view-models';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-deal-export',
  templateUrl: './deal-export.component.html',
  styleUrls: ['./deal-export.component.scss']
})
export class DealExportComponent {
  @Input() data: DealVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Deal Export');
    XLSX.writeFile(wb, 'deal-export-' + new Date().getTime() + '.xlsx');
  }
}
