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
import { AngularEditorConfig } from '@kolkov/angular-editor';

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
  errorImage = false;
  message = '';
  config: AngularEditorConfig = {
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
  };
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
      price: new FormControl(this.product ? this.product.price : undefined, [Validators.required, Validators.min(0)]),
      description: new FormControl(this.product ? this.product.description : ''),
      category: new FormControl(this.product ? this.product.category : undefined, [Validators.required]),
      image: new FormControl(undefined),
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
  useSelectImage = (event: any, input: HTMLElement) => {
    this.errorImage = false;
    const files: File[] = event.target.files;
    if (files.length > 1) {
      this.errorImage = true;
      this.message = 'Only one image accepted';
      input.nodeValue = undefined;
    } else {
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(files[0].type)) {
        if (files[0].size > 1024 * 1024 * 18) {
          this.errorImage = true;
          this.message = 'Only image size less than 18MB accept';
          input.nodeValue = undefined;
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.form.get('image').setValue(reader.result);
          };
          reader.readAsDataURL(files[0]);
        }
      } else {
        this.errorImage = true;
        this.message = 'Only image file accept';
        input.nodeValue = undefined;
      }
    }
  }
  useRemoveParameter = (index: number) => {
    (this.form.get('parameters') as FormArray).removeAt(index);
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
    const code = this.form.get('code');
    if (code.valid) {
      this.stage = 'querying';
      setTimeout(async () => {
        const check = await this.productService.checkUnique('code', code.value).toPromise();
        if (code.valid && check) {
          code.setErrors({ duplicate: true });
        }
        this.stage = 'done';
      }, 1000);
    }
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
            this.useDone.emit(data);
            this.toastrService.success('', 'Save product successful!', { duration: 3000 });
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
