import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { RoleVM } from '@view-models';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-role-export',
  templateUrl: './role-export.component.html',
  styleUrls: ['./role-export.component.scss']
})
export class RoleExportComponent {
  @Input() data: RoleVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Role Export');
    XLSX.writeFile(wb, 'role-export-' + new Date().getTime() + '.xlsx');
  }
}
