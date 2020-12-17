import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NbToastrService } from '@nebular/theme';
import { ProductService } from '@services';
import { ProductVM } from '@view-models';
import { DropResult } from 'ngx-smooth-dnd';
import { Subscription, of } from 'rxjs';
import { finalize, tap, catchError } from 'rxjs/operators';
import * as XLSX from 'xlsx';
interface IProductImportPageState {
  formArray: FormArray;
  config: AngularEditorConfig;
}
@Component({
  selector: 'app-product-import',
  templateUrl: './product-import.page.html',
  styleUrls: ['./product-import.page.scss']
})
export class ProductImportPage implements OnChanges, OnDestroy {
  @Input() data: ProductVM[];
  @Output() useChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() useLoading: EventEmitter<any> = new EventEmitter<any>();
  @Output() useUnLoading: EventEmitter<any> = new EventEmitter<any>();
  subscriptions: Subscription[] = [];
  state: IProductImportPageState = {
    formArray: new FormArray([]),
    config: {
      editable: true,
      spellcheck: true,
      height: '20rem',
      minHeight: '5rem',
      placeholder: 'Enter text here...',
      translate: 'no',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
      toolbarHiddenButtons: [
        ['bold']
      ],
      customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ]
    },
  }
  constructor(
    protected readonly service: ProductService,
    protected readonly toastrService: NbToastrService,
  ) { }

  ngOnChanges() {
    if (this.data) {
      this.state.formArray.clear();
      for (const item of this.data) {
        const group = new FormGroup({
          code: new FormControl('New Code', [Validators.required]),
          name: new FormControl('New Product', [Validators.required]),
          price: new FormControl(undefined, [Validators.required, Validators.min(0)]),
          image: new FormControl(undefined),
          parameters: new FormArray([]),
          category: new FormControl(undefined),
          codeStage: new FormControl('done'),
          errorImage: new FormControl(false),
          errorImageMessage: new FormControl(''),
          description: new FormControl(''),
        });
        const elements = [];
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const element = item[key];
            elements.push(element);
            if (group.get(key)) {
              group.get(key).setValue(element);
              group.get(key).markAsTouched();
            }
          }
        }
        this.state.formArray.push(group);
      }
    }
  }
  useImport = () => {
    if (this.state.formArray.valid) {
      this.useLoading.emit();
      const subscription = this.service.import(this.state.formArray.controls.map((e) => ({
        ...e.value,
        price: parseInt(e.value.price, 0)
      }))).pipe(
        tap((data) => {
          this.toastrService.success('', 'Import products successful!', { duration: 3000 });
          this.useChange.emit();
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Import products fail! ' + err.error.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useUnLoading.emit();
        })
      ).subscribe();
      this.subscriptions.push(subscription);
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
    const code = form.get('code');
    if (code.valid) {
      form.get('codeStage').setValue('querying');
      const subscription = this.service.checkUnique('code', code.value)
        .pipe(
          tap((check) => {
            if (check) {
              code.setErrors({ duplicate: true });
            }
          }),
          finalize(() => {
            setTimeout(async () => {
              form.get('codeStage').setValue('done');
            }, 1000);
          })
        ).subscribe()
      this.subscriptions.push(subscription);
    }
  }
  useSelectImage = (event: any, input: HTMLElement, form: FormGroup) => {
    form.get('errorImage').setValue(false);
    const files: File[] = event.target.files;
    if (files.length > 1) {
      form.get('errorImage').setValue(true);
      form.get('errorImageMessage').setValue('Only one image accepted');
      input.nodeValue = undefined;
    } else {
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(files[0].type)) {
        if (files[0].size > 1024 * 1024 * 18) {
          form.get('errorImage').setValue(true);
          form.get('errorImageMessage').setValue('Only image size less than 18MB accept');
          input.nodeValue = undefined;
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            form.get('image').setValue(reader.result);
          };
          reader.readAsDataURL(files[0]);
        }
      } else {
        form.get('errorImage').setValue(true);
        form.get('errorImageMessage').setValue('Only one image accepted');
        input.nodeValue = undefined;
      }
    }
  }
  useRemoveItem = (index: number) => {
    this.state.formArray.removeAt(index);
    if (this.state.formArray.length === 0) {
      this.data = undefined;
      this.useChange.emit();
    }
  }
  useRemoveParameter = (index: number, form: FormGroup) => {
    (form.get('parameters') as FormArray).removeAt(index);
  }
  useAddParameter = (form: FormGroup) => {
    (form.get('parameters') as FormArray).push(new FormGroup({
      label: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
    }));
  }
  useDrop = (event: DropResult, form: FormGroup) => {
    if (event.removedIndex != null && event.addedIndex != null) {
      moveItemInArray((form.get('parameters') as FormArray).controls, event.removedIndex, event.addedIndex);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
