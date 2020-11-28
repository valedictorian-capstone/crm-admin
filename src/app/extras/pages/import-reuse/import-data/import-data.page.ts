import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as XLSX from 'xlsx';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reuse-import-data',
  templateUrl: './import-data.page.html',
  styleUrls: ['./import-data.page.scss']
})
export class ImportDataPage implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() importType: string;
  type = 'customer';
  data: any[];
  constructor(
    protected readonly toastrService: NbToastrService,
    public readonly spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    if (this.importType) {
      this.type = this.importType;
    }
  }
  useChange = (file: NzUploadFile) => {
    if (file.name.match(/(.xls|.xlsx)/)) {
      const reader: FileReader = new FileReader();
      reader.onloadend = async () => {
        const bstr: string | ArrayBuffer = reader.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.data = XLSX.utils.sheet_to_json(ws);
      };
      reader.readAsBinaryString(file as any);
    } else {
      this.toastrService.danger('', 'This file is not follow extendsion', { duration: 3000 });
    }
    return false;
  }
  useShowSpinner = () => {
    this.spinner.show('import-data');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('import-data');
    }, 1000);
  }
}
