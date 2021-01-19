import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ProductVM } from '@view-models';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-product-export',
  templateUrl: './product-export.component.html',
  styleUrls: ['./product-export.component.scss']
})
export class ProductExportComponent {
  @Input() data: ProductVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Product Export');
    XLSX.writeFile(wb, 'product-export-' + new Date().getTime() + '.xlsx');
  }
}
