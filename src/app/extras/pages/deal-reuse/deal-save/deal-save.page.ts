import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PipelineSelectComponent, ProductSelectComponent } from '@extras/components';
import { CustomerSavePage } from '@extras/pages';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { DealService, PipelineService, ProductService, StageService } from '@services';
import { AccountVM, DealDetailVM, DealVM, PipelineVM, ProductVM, StageVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, of } from 'rxjs';
import { finalize, switchMap, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { authSelector } from '@store/selectors';
interface IDealSavePageState {
  you: AccountVM;
  pipelines: PipelineVM[];
  form: FormGroup;
  canAssign: boolean;
  adding: boolean;
}
@Component({
  selector: 'app-reuse-deal-save',
  templateUrl: './deal-save.page.html',
  styleUrls: ['./deal-save.page.scss']
})
export class DealSavePage implements OnInit, OnDestroy {
  @ViewChild('pipelineSelect') pipelineSelect: PipelineSelectComponent;
  @ViewChild('customerSave') customerSave: CustomerSavePage;
  @ViewChild('productSelect') productSelect: ProductSelectComponent;
  @ViewChild('submitRef') submitRef: TemplateRef<any>;
  @ViewChild('cancelRef') cancelRef: TemplateRef<any>;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<DealVM> = new EventEmitter<DealVM>();
  @Input() payload: { deal: DealVM, pipeline: PipelineVM, inside: boolean, stage: StageVM } = {
    deal: undefined,
    pipeline: undefined,
    stage: undefined,
    inside: false
  };
  subscriptions: Subscription[] = [];
  state: IDealSavePageState = {
      you: undefined,
      form: undefined,
      canAssign: false,
      adding: false,
      pipelines: [],
    };
  constructor(
    protected readonly service: DealService,
    protected readonly pipelineService: PipelineService,
    protected readonly stageService: StageService,
    protected readonly productService: ProductService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
    this.useShowSpinner();
    this.useInitForm();
  }

  ngOnInit() {
    if (this.payload.deal) {
      this.useSetData();
    } else {
      this.useInit();
    }

  }
  useLoadMine = () => {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            this.state.you = profile;
            this.state.canAssign = this.state.you.roles.filter((role) => role.canAssignActivity).length > 0;
          })
        )
        .subscribe()
    );
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      title: new FormControl('New Deal', [Validators.required]),
      description: new FormControl(''),
      status: new FormControl('processing'),
      stage: new FormControl(undefined, [Validators.required]),
      customer: new FormControl(undefined, [Validators.required]),
      assignee: new FormControl(undefined, [Validators.required]),
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
    this.subscriptions.push(
      this.service.findById(this.payload.deal.id)
        .pipe(
          tap((data) => {
            this.payload.deal = data;
            this.state.form.addControl('id', new FormControl(this.payload.deal.id));
            this.state.form.patchValue(this.payload.deal);
            if (this.payload.deal.dealDetails.length > 0) {
              this.state.form.get('dealDetails').patchValue(this.payload.deal.dealDetails.map((dealDetail) => ({
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
            this.payload.stage = data;
          }),
          switchMap((data) => this.pipelineService.findById(data.pipeline.id)),
          tap((data) => {
            this.payload.pipeline = data;
          }),
          switchMap(() => this.pipelineService.findAll()),
          tap((data) => {
            if (this.payload.pipeline) {
              this.state.pipelines = data.filter((pipeline) => pipeline.id === this.payload.pipeline.id
                || (pipeline.id !== this.payload.pipeline.id && !pipeline.isDelete));
            } else {
              this.state.pipelines = data.filter((pipeline) => !pipeline.isDelete);
            }
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        )
        .subscribe()
    );
  }
  useInit = () => {
    this.subscriptions.push(
      this.pipelineService.findAll()
        .pipe(
          tap((data) => {
            this.state.pipelines = data.filter((pipeline) => !pipeline.isDelete);
            if (!this.payload.pipeline) {
              const selectedPipeline = localStorage.getItem('selectedPipeline');
              if (!selectedPipeline && this.state.pipelines[0]) {
                localStorage.setItem('selectedPipeline', this.state.pipelines[0].id);
              }
              this.useSelectPipeline(selectedPipeline);
            } else {
              if (!this.payload.stage) {
                this.payload.stage = this.payload.pipeline.stages[0];
              }
              this.state.form.get('stage').setValue(this.payload.stage);
            }
            if (this.state.you) {
              this.state.form.get('assignee').setValue(this.state.you);
            }
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        )
        .subscribe()
    );
  }
  useSelectProduuct = (dealDetails: DealDetailVM[]) => {
    (this.state.form.get('dealDetails') as FormArray).controls = dealDetails.map((e) => new FormGroup({
      product: new FormControl(e.product),
      quantity: new FormControl(e.quantity, [Validators.required, Validators.min(0)])
    }));
  }
  usePipelineSearch = (value: string) => {
    this.pipelineSelect.useSearch(value);
  }
  useSelectPipeline = async (selected: string) => {
    if (selected !== this.payload.pipeline?.id) {
      this.payload.pipeline = await this.pipelineService.findById(selected).toPromise();
      this.payload.stage = this.payload.pipeline.stages[0];
      this.state.form.get('stage').setValue(this.payload.stage);
    }
  }
  useSubmit = async (ref: NbDialogRef<any>) => {
    ref.close();
    if ((this.state.form.valid && !this.state.adding) || (this.state.form.valid && this.state.adding && this.customerSave && this.customerSave.state.form.valid)) {
      this.useShowSpinner();
      if (this.state.adding && this.customerSave && this.customerSave.state.form) {
        this.customerSave.useSubmit(undefined);
        this.customerSave.useDone.subscribe((data) => {
          this.state.form.get('customer').setValue(data);
        });
      }
      const dealDetails = this.state.form.value.dealDetails;
      for (const detail of this.state.form.value.dealDetails) {
        if (detail.product.isNew) {
          detail.product = await this.productService.insert({
            ...detail.product, id: undefined,
            code: detail.product.name + '-' + Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
              .map((x) => x[Math.floor(Math.random() * x.length)]).join('')
          }).toPromise();
        }
      }
      this.subscriptions.push(
        (this.payload.deal ? this.service.update({
          ...this.state.form.value,
          dealDetails: this.payload.inside ? undefined : dealDetails
        }) : this.service.insert({
          ...this.state.form.value,
          dealDetails: this.payload.inside ? undefined : dealDetails
        }))
          .pipe(
            tap((data) => {
              this.useDone.emit(data);
              this.toastrService.success('', 'Save deal successful!', { duration: 3000 });
              this.useClose.emit();
            }),
            catchError((err) => {
              this.toastrService.danger('', 'Save deal fail! ' + err.error.message, { duration: 3000 });
              return of(undefined);
            }),
            finalize(() => {
              this.useHideSpinner();
            })
          ).subscribe()
      );
    } else {
      this.state.form.markAsUntouched();
      this.state.form.markAsTouched();
      if (this.state.adding && this.customerSave && this.customerSave.state.form) {
        this.customerSave.state.form.markAsUntouched();
        this.customerSave.state.form.markAsTouched();
      }
    }
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useRemoveDealDetail = (index: number) => {
    (this.state.form.get('dealDetails') as FormArray).removeAt(index);
  }
  useAddDealDetail = () => {
    (this.state.form.get('dealDetails') as FormArray).push(new FormGroup({
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
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
