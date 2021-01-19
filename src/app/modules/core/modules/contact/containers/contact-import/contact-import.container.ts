import { Component } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { CustomerVM } from '@view-models';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as XLSX from 'xlsx';
import { IContactImportState } from '../../extras/interfaces';

@Component({
  selector: 'app-contact-import-container',
  templateUrl: './contact-import.container.html',
  styleUrls: ['./contact-import.container.scss']
})
export class ContactImportContainer {
  state: IContactImportState = {
    active: 1,
    array: [],
    data: [],
    paginationArray: [],
  };
  data: CustomerVM[] = [];
  constructor(
    protected readonly toastrService: NbToastrService,
  ) { }

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

  usePagination = () => {
    // this.state.paginationArray = this.state.filterArray.filter((e, i) => {
    //   i = i + 1;
    //   const page = this.state.active * 20;
    //   return i >= page - 19 && i <= page;
    // })
  }

}
