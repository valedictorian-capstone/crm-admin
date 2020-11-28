import { moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { ProductService } from '@services';
import { ProductVM } from '@view-models';
import { DropResult } from 'ngx-smooth-dnd';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reuse-product-save',
  templateUrl: './product-save.page.html',
  styleUrls: ['./product-save.page.scss']
})
export class ProductSavePage implements OnInit {
  @Input() product: ProductVM;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<ProductVM> = new EventEmitter<ProductVM>();
  form: FormGroup;
  stage = 'done';
  constructor(
    protected readonly datePipe: DatePipe,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly productService: ProductService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useShowSpinner();
    this.useInitForm();
  }
  ngOnInit() {
    if (this.product) {
      this.useSetData();
    }
    this.useHideSpinner();
  }
  useInitForm = () => {
    this.form = new FormGroup({
      code: new FormControl(this.product ? this.product.code : 'New Code', [Validators.required]),
      name: new FormControl(this.product ? this.product.name : 'New Product', [Validators.required]),
      type: new FormControl(this.product ? this.product.type : '', [Validators.required]),
      price: new FormControl(this.product ? this.product.price : undefined, [Validators.required, Validators.min(0)]),
      description: new FormControl(this.product ? this.product.description : ''),
      category: new FormControl(this.product ? this.product.category : undefined),
      parameters: new FormArray(this.product ? this.product.parameters.map((parameter) => new FormGroup({
        label: new FormControl(parameter.label, [Validators.required]),
        value: new FormControl(parameter.value, [Validators.required]),
      })) : []),
    });
  }
  useSetData = () => {
    this.productService.findById(this.product.id).subscribe((data) => {
      this.product = data;
      this.form.addControl('id', new FormControl(this.product.id));
      this.form.patchValue(this.product);
    });
  }
  useRemoveParameter = (index: number) => {
    (this.form.get('parameters') as FormArray).controls.splice(index, 1);
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useAddParameter = () => {
    (this.form.get('parameters') as FormArray).push(new FormGroup({
      label: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
    }));
  }
  useCheckCode = () => {
    this.stage = 'querying';
    setTimeout(async () => {
      const code = this.form.get('code');
      const check = await this.productService.checkUnique('code', code.value).toPromise();
      if (code.valid && check) {
        code.setErrors({ duplicate: true });
      }
      this.stage = 'done';
    }, 1000);
  }
  useSubmit = (ref: NbDialogRef<any>) => {
    ref.close();
    if (this.form.valid) {
      this.useShowSpinner();
      setTimeout(() => {
        (this.product ? this.productService.update({
          ...this.form.value,
          price: parseInt(this.form.value.price, 0)
        }) : this.productService.insert({
          ...this.form.value,
          price: parseInt(this.form.value.price, 0)
        }))
          .pipe(
            finalize(() => {
              this.useHideSpinner();
            })
          ).subscribe((data) => {
            this.productService.triggerValue$.next({ type: this.product ? 'update' : 'create', data });
            this.useDone.emit(data);
            this.toastrService.success('', 'Save product success!', { duration: 3000 });
            this.useClose.emit();
          }, (err) => {
            this.toastrService.danger('', 'Save product fail! Something wrong at runtime', { duration: 3000 });
          });
      }, 2000);
    } else {
      this.form.markAsUntouched();
      this.form.markAsTouched();
    }
  }
  useDrop = (event: DropResult) => {
    if (event.removedIndex != null && event.addedIndex != null) {
      moveItemInArray((this.form.get('parameters') as FormArray).controls, event.removedIndex, event.addedIndex);
    }
  }
  useShowSpinner = () => {
    this.spinner.show('product-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('product-save');
    }, 1000);
  }
}
