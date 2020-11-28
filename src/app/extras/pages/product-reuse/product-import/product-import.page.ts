import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ElementRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { ProductService } from '@services';
import { ProductVM } from '@view-models';
import * as XLSX from 'xlsx';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-import',
  templateUrl: './product-import.page.html',
  styleUrls: ['./product-import.page.scss']
})
export class ProductImportPage implements OnInit, OnChanges {
  @Input() data: ProductVM[];
  @Output() useChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() useLoading: EventEmitter<any> = new EventEmitter<any>();
  @Output() useUnLoading: EventEmitter<any> = new EventEmitter<any>();
  products: FormArray = new FormArray([
    new FormGroup({
      code: new FormControl('New Code', [Validators.required]),
      name: new FormControl('New Product', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      price: new FormControl(undefined, [Validators.required, Validators.min(0)]),
      category: new FormControl(undefined),
    })
  ]);
  constructor(
    protected readonly productService: ProductService,
    protected readonly toastrService: NbToastrService,
  ) { }

  ngOnInit() {

  }
  ngOnChanges() {
    if (this.data) {
      this.products.clear();
      for (const item of this.data) {
        const group = new FormGroup({
          code: new FormControl('New Code', [Validators.required]),
          name: new FormControl('New Product', [Validators.required]),
          type: new FormControl('', [Validators.required]),
          price: new FormControl(undefined, [Validators.required, Validators.min(0)]),
          category: new FormControl(undefined),
        });
        const elements = [];
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const element = item[key];
            elements.push(element);
            if (group.get(key)) {
              group.get(key).setValue(element);
            }
          }
        }
        (group as any).autoCompleteData = elements;
        this.useCheckCode(group);
        this.products.controls.push(group);
      }
    }
  }
  useImport = () => {
    if (this.products.valid) {
      this.useLoading.emit();
      this.productService.import(this.products.controls.map((e) => ({
        ...e.value,
        price: parseInt(e.value.price, 0)
      }))).pipe(
        finalize(() => {
          this.useUnLoading.emit();
        })
      ).subscribe((data) => {
        data.forEach((e) => this.productService.triggerValue$.next({ type: 'create', data: e }));
        this.toastrService.success('', 'Import products success!', { duration: 3000 });
        this.useChange.emit();
      }, (err) => {
        this.toastrService.danger('', 'Import products fail! Something wrong at runtime', { duration: 3000 });
      });
    }
  }
  useDownload = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Product Example Import');
    XLSX.writeFile(wb, 'product-example' + new Date().getTime() + '.xlsx');
  }
  useCheckCode = (form: FormGroup) => {
    if (form.get('code').value) {
      (form as any).codeStage = 'querying';
      setTimeout(async () => {
        const code = form.get('code');
        const check = await this.productService.checkUnique('code', code.value).toPromise();
        if (code.valid && check) {
          code.setErrors({ duplicate: true });
        }
        (form as any).codeStage = 'done';
      }, 1000);
    }
  }
}
