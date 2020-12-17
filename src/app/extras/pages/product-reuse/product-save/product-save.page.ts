import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { ProductService } from '@services';
import { ProductVM } from '@view-models';
import { DropResult } from 'ngx-smooth-dnd';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, of } from 'rxjs';
import { finalize, tap, catchError } from 'rxjs/operators';

interface IProductSavePageState {
  form: FormGroup;
  stage: 'done' | 'querying';
  errorImage: boolean;
  message: string;
  config: AngularEditorConfig;
}
@Component({
  selector: 'app-reuse-product-save',
  templateUrl: './product-save.page.html',
  styleUrls: ['./product-save.page.scss']
})
export class ProductSavePage implements OnInit, OnDestroy {
  @Input() product: ProductVM;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<ProductVM> = new EventEmitter<ProductVM>();
  subscriptions: Subscription[] = [];
  state: IProductSavePageState = {
      form: undefined,
      stage: 'done',
      errorImage: false,
      message: '',
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
      }
    };
  constructor(
    protected readonly service: ProductService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useInitForm();
  }
  ngOnInit() {
    if (this.product) {
      this.useSetData();
    }
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
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
    this.useShowSpinner();
    const subscription = this.service.findById(this.product.id)
      .pipe(
        tap((data) => {
          this.product = data;
          this.state.form.addControl('id', new FormControl(this.product.id));
          this.state.form.patchValue(this.product);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useSelectImage = (event: any, input: HTMLElement) => {
    this.state.errorImage = false;
    const files: File[] = event.target.files;
    if (files.length > 1) {
      this.state.errorImage = true;
      this.state.message = 'Only one image accepted';
      input.nodeValue = undefined;
    } else {
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(files[0].type)) {
        if (files[0].size > 1024 * 1024 * 18) {
          this.state.errorImage = true;
          this.state.message = 'Only image size less than 18MB accept';
          input.nodeValue = undefined;
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.state.form.get('image').setValue(reader.result);
          };
          reader.readAsDataURL(files[0]);
        }
      } else {
        this.state.errorImage = true;
        this.state.message = 'Only image file accept';
        input.nodeValue = undefined;
      }
    }
  }
  useRemoveParameter = (index: number) => {
    (this.state.form.get('parameters') as FormArray).removeAt(index);
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useAddParameter = () => {
    (this.state.form.get('parameters') as FormArray).push(new FormGroup({
      label: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
    }));
  }
  useCheckCode = () => {
    const code = this.state.form.get('code');
    if (code.valid) {
      this.state.stage = 'querying';
      const subscription = this.service.checkUnique('code', code.value)
        .pipe(
          tap((check) => {
            if (check) {
              code.setErrors({ duplicate: true });
            }
          }),
          finalize(() => {
            setTimeout(async () => {
              this.state.stage = 'done';
            }, 1000);
          })
        ).subscribe();
      this.subscriptions.push(subscription);
    }
  }
  useSubmit = (ref: NbDialogRef<any>) => {
    ref.close();
    if (this.state.form.valid) {
      this.useShowSpinner();
      const subscription = (this.product ? this.service.update({
        ...this.state.form.value,
        price: parseInt(this.state.form.value.price, 0)
      }) : this.service.insert({
        ...this.state.form.value,
        price: parseInt(this.state.form.value.price, 0)
      }))
        .pipe(
          tap((data) => {
            this.useDone.emit(data);
            this.toastrService.success('', 'Save product successful!', { duration: 3000 });
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Save product fail! ' + err.error.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        ).subscribe()
      this.subscriptions.push(subscription);
    } else {
      this.state.form.markAsUntouched();
      this.state.form.markAsTouched();
    }
  }
  useDrop = (event: DropResult) => {
    if (event.removedIndex != null && event.addedIndex != null) {
      moveItemInArray((this.state.form.get('parameters') as FormArray).controls, event.removedIndex, event.addedIndex);
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
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
