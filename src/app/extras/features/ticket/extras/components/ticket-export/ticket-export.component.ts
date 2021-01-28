import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { TicketVM } from '@view-models';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ticket-export',
  templateUrl: './ticket-export.component.html',
  styleUrls: ['./ticket-export.component.scss']
})
export class TicketExportComponent {
  @Input() data: TicketVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ticket Export');
    XLSX.writeFile(wb, 'ticket-export-' + new Date().getTime() + '.xlsx');
  }
}
