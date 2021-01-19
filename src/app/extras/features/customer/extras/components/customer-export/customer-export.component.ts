import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { CustomerVM } from '@view-models';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-customer-export',
  templateUrl: './customer-export.component.html',
  styleUrls: ['./customer-export.component.scss']
})
export class CustomerExportComponent {
  @Input() data: CustomerVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customer Export');
    XLSX.writeFile(wb, 'customer-export-' + new Date().getTime() + '.xlsx');
  }

}
