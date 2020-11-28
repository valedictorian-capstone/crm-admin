import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PipelineSelectComponent, ProductSelectComponent } from '@extras/components';
import { CustomerSavePage } from '@extras/pages';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { DealService, PipelineService, ProductService, StageService } from '@services';
import { DealDetailVM, DealVM, PipelineVM, ProductVM, StageVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, switchMap, tap } from 'rxjs/operators';
@Component({
  selector: 'app-reuse-deal-save',
  templateUrl: './deal-save.page.html',
  styleUrls: ['./deal-save.page.scss']
})
export class DealSavePage implements OnInit {
  @ViewChild('pipelineSelect') pipelineSelect: PipelineSelectComponent;
  @ViewChild('customerSave') customerSave: CustomerSavePage;
  @ViewChild('productSelect') productSelect: ProductSelectComponent;
  @ViewChild('submitRef') submitRef: TemplateRef<any>;
  @ViewChild('cancelRef') cancelRef: TemplateRef<any>;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<DealVM> = new EventEmitter<DealVM>();
  @Input() deal: DealVM;
  @Input() inside = false;
  @Input() stage: StageVM;
  @Input() pipeline: PipelineVM;
  pipelines: PipelineVM[] = [];
  form: FormGroup;
  adding = false;
  constructor(
    protected readonly pipelineService: PipelineService,
    protected readonly stageService: StageService,
    protected readonly productService: ProductService,
    protected readonly dealService: DealService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useShowSpinner();
    this.useInitForm();
  }

  ngOnInit() {
    if (this.deal) {
      this.useSetData();
    } else {
      this.useInit();
    }

  }
  useInitForm = () => {
    this.form = new FormGroup({
      title: new FormControl('New Deal', [Validators.required]),
      description: new FormControl(''),
      status: new FormControl('processing'),
      stage: new FormControl(undefined, [Validators.required]),
      customer: new FormControl(undefined, [Validators.required]),
      dealDetails: new FormArray([
        new FormGroup({
          product: new FormGroup({
            id: new FormControl(undefined),
            name: new FormControl(undefined, [Validators.required]),
            price: new FormControl(0, [Validators.required]),
            isNew: new FormControl(true),
          }),
          quantity: new FormControl(1, [Validators.required]),
        }),
      ]),
    });
  }
  useSetData = () => {
    this.dealService.findById(this.deal.id)
      .pipe(
        tap((data) => {
          this.deal = data;
          this.form.addControl('id', new FormControl(this.deal.id));
          this.form.patchValue(this.deal);
          if (this.deal.dealDetails.length > 0) {
            this.form.get('dealDetails').patchValue(this.deal.dealDetails.map((dealDetail) => ({
              quantity: dealDetail.quantity,
              product: {
                id: dealDetail.product.id,
                name: dealDetail.product.name,
                price: dealDetail.product.price,
                isNew: false
              }
            })));
          }
        }),
        switchMap((data) => this.stageService.findById(data.stage.id)),
        tap((data) => {
          this.stage = data;
        }),
        switchMap((data) => this.pipelineService.findById(data.pipeline.id)),
        tap((data) => {
          this.pipeline = data;
        }),
        switchMap(() => this.pipelineService.findAll()),
        tap((data) => {
          this.pipelines = data;
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe();
  }
  useInit = () => {
    this.pipelineService.findAll()
      .pipe(
        tap((data) => {
          this.pipelines = data;
          if (!this.pipeline) {
            const selectedPipeline = localStorage.getItem('selectedPipeline');
            if (!selectedPipeline && this.pipelines[0]) {
              localStorage.setItem('selectedPipeline', this.pipelines[0].id);
            }
            this.useSelectPipeline(selectedPipeline);
          } else {
            if (!this.stage) {
              this.stage = this.pipeline.stages[0];
            }
            this.form.get('stage').setValue(this.stage);
          }
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe();
  }
  useSelectProduuct = (dealDetails: DealDetailVM[]) => {
    (this.form.get('dealDetails') as FormArray).controls = dealDetails.map((e) => new FormGroup({
      product: new FormControl(e.product),
      quantity: new FormControl(e.quantity, [Validators.required, Validators.min(0)])
    }));
  }
  usePipelineSearch = (value: string) => {
    this.pipelineSelect.useChangeValue(value);
  }
  useSelectPipeline = async (selected: string) => {
    if (selected !== this.pipeline?.id) {
      this.pipeline = await this.pipelineService.findById(selected).toPromise();
      this.stage = this.pipeline.stages[0];
      this.form.get('stage').setValue(this.stage);
    }
  }
  useSubmit = async (ref: NbDialogRef<any>) => {
    ref.close();
    if ((this.form.valid && !this.adding) || (this.form.valid && this.adding && this.customerSave && this.customerSave.form.valid)) {
      this.useShowSpinner();
      if (this.adding && this.customerSave && this.customerSave.form) {
        this.customerSave.useSubmit(undefined);
        this.customerSave.useDone.subscribe((data) => {
          this.form.get('customer').setValue(data);
        });
      }
      const dealDetails = this.form.value.dealDetails;
      for (const detail of this.form.value.dealDetails) {
        if (detail.product.isNew) {
          detail.product = await this.productService.insert({
            ...detail.product, id: undefined,
            code: detail.product.name + '-' + Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
              .map((x) => x[Math.floor(Math.random() * x.length)]).join('')
          }).toPromise();
        }
      }
      (this.deal ? this.dealService.update({
        ...this.form.value,
        dealDetails: this.inside ? undefined : dealDetails
      }) : this.dealService.insert({
        ...this.form.value,
        dealDetails: this.inside ? undefined : dealDetails
      }))
        .pipe(
          finalize(() => {
            this.useHideSpinner();
          })
        ).subscribe((data) => {
          this.dealService.triggerValue$.next({ type: this.deal ? 'update' : 'create', data });
          this.useDone.emit(data);
          this.toastrService.success('', 'Save deal success!', { duration: 3000 });
          this.useClose.emit();
        }, (err) => {
          this.toastrService.danger('', 'Save deal fail! Something wrong at runtime', { duration: 3000 });
        });
    } else {
      this.form.markAsUntouched();
      this.form.markAsTouched();
      if (this.adding && this.customerSave && this.customerSave.form) {
        this.customerSave.form.markAsUntouched();
        this.customerSave.form.markAsTouched();
      }
    }
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useRemoveDealDetail = (index: number) => {
    (this.form.get('dealDetails') as FormArray).controls.splice(index, 1);
  }
  useAddDealDetail = () => {
    (this.form.get('dealDetails') as FormArray).push(new FormGroup({
      product: new FormGroup({
        id: new FormControl(undefined),
        name: new FormControl(undefined, [Validators.required]),
        price: new FormControl(0, [Validators.required]),
        isNew: new FormControl(true),
      }),
      quantity: new FormControl(1, [Validators.required]),
    }));
  }
  useChangeDealDetail = (product: ProductVM, group: FormGroup, isNew: boolean) => {
    group.get('id').setValue(product.id);
    group.get('name').setValue(product.name);
    group.get('price').setValue(product.price);
    group.get('isNew').setValue(isNew);
  }
  useAmount = (group: FormGroup) => {
    const price = group.get('product').get('price').value && group.get('product').get('price').value !== '' ? group.get('product').get('price').value : '0';
    const quantity = group.get('quantity').value && group.get('quantity').value !== '' ? group.get('quantity').value : '0';
    const rs = parseInt(price, 0) * parseInt(quantity, 0);
    return new Intl.NumberFormat('en', {
      minimumFractionDigits: 0
    }).format(Number(rs));
  }
  useShowSpinner = () => {
    this.spinner.show('deal-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('deal-save');
    }, 1000);
  }
}
