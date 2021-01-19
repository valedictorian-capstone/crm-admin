import { Component, Input, ElementRef } from '@angular/core';
import { NoteVM } from '@view-models';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-note-export',
  templateUrl: './note-export.component.html',
  styleUrls: ['./note-export.component.scss']
})
export class NoteExportComponent {
  @Input() data: NoteVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Note Export');
    XLSX.writeFile(wb, 'note-export-' + new Date().getTime() + '.xlsx');
  }
}
