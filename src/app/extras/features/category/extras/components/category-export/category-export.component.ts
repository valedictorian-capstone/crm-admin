import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { CategoryVM } from '@view-models';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-category-export',
  templateUrl: './category-export.component.html',
  styleUrls: ['./category-export.component.scss']
})
export class CategoryExportComponent {
  @Input() data: CategoryVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Category Export');
    XLSX.writeFile(wb, 'category-export-' + new Date().getTime() + '.xlsx');
  }
}
