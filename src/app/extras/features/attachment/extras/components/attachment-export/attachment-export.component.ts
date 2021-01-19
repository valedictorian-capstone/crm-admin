import { Component, Input, ElementRef } from '@angular/core';
import { AttachmentVM } from '@view-models';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-attachment-export',
  templateUrl: './attachment-export.component.html',
  styleUrls: ['./attachment-export.component.scss']
})
export class AttachmentExportComponent {
  @Input() data: AttachmentVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attachment Export');
    XLSX.writeFile(wb, 'attachment-export-' + new Date().getTime() + '.xlsx');
  }
}
