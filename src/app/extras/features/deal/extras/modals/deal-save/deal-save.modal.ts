import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PipelineSelectComponent, ProductSelectComponent } from '@extras/components';
import { CustomerSavePage } from '@extras/pages';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { DealService, PipelineService, ProductService, StageService } from '@services';
import { DealAction } from '@store/actions';
import { authSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, CustomerVM, DealDetailVM, DealVM, PipelineVM, ProductVM, StageVM, CampaignVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

interface IDealSavePageState {
  you: AccountVM;
  pipelines: PipelineVM[];
  form: FormGroup;
  canAssign: boolean;
  adding: boolean;
}
interface IDealSavePagePayload {
  deal: DealVM;
  campaign: CampaignVM;
  pipeline: PipelineVM;
  inside: boolean;
  stage: StageVM;
  fix: boolean;
  customer: CustomerVM;
  for: 'campaign' | 'basic';
}
@Component({
  selector: 'app-deal-save',
  templateUrl: './deal-save.modal.html',
  styleUrls: ['./deal-save.modal.scss']
})
export class DealSaveModal implements OnInit, OnDestroy {
  @ViewChild('pipelineSelect') pipelineSelect: PipelineSelectComponent;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<DealVM> = new EventEmitter<DealVM>();
  @Input() payload: IDealSavePagePayload = {
    deal: undefined,
    campaign: undefined,
    pipeline: undefined,
    customer: undefined,
    stage: undefined,
    inside: false,
    fix: false,
    for: 'basic'
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
    this.useInitForm();
  }

  ngOnInit() {
    if (this.payload.deal) {
      this.useSetData();
    } else {
      this.useInit();
    }
    if (this.payload.for) {
      this.state.form.get('for').setValue(this.payload.for);
    }
  }
  useInit() {
    console.log(this.payload);
    this.state.form.get('assignee').setValue(this.state.you);
    this.state.form.get('customer').setValue(this.payload.customer);
    this.state.form.get('campaign').setValue(this.payload.campaign);
    this.state.form.get('pipeline').setValue(this.payload.pipeline);
    console.log(this.state.form);
    if (this.state.form.get('pipeline').value) {
      if (this.payload.stage) {
        this.state.form.get('stage').setValue(this.payload.stage);
      } else {
        this.state.form.get('stage').setValue(this.state.form.get('pipeline').value.stages[0]);
      }
    }
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          if (profile) {
            this.state.you = profile;
            this.state.canAssign = this.state.you.roles.filter((role) => role.canAssignActivity).length > 0;
          }
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      title: new FormControl('New Deal', [Validators.required]),
      description: new FormControl(''),
      for: new FormControl('basic'),
      service: new FormControl(undefined),
      status: new FormControl('processing'),
      campaign: new FormControl(undefined, [Validators.required]),
      pipeline: new FormControl(undefined),
      stage: new FormControl(undefined, [Validators.required]),
      customer: new FormControl(undefined, [Validators.required]),
      assignee: new FormControl(undefined, [Validators.required]),
    });
    this.subscriptions.push(
      this.state.form.get('for').valueChanges
        .pipe(
          tap((data) => {
            if (data === 'campaign') {
              this.state.form.get('campaign').setValidators([Validators.required]);
            } else {
              this.state.form.get('campaign').setValidators([]);
              this.state.form.get('campaign').setErrors(null);
            }
          })
        ).subscribe()
    );
  }
  useSetData = () => {
    this.useShowSpinner();
    const subscription = this.service.findById(this.payload.deal.id)
      .pipe(
        tap((data) => {
          this.store.dispatch(DealAction.SaveSuccessAction({ res: data }));
          this.payload.deal = data;
          this.state.form.addControl('id', new FormControl(this.payload.deal.id));
          this.state.form.patchValue(this.payload.deal);
          this.state.form.get('pipeline').setValue(data.stage.pipeline);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe()
    this.subscriptions.push(subscription);
  }
  usePipelineSearch = (value: string) => {
    this.pipelineSelect.useSearch(value);
  }
  useSelectPipeline = async (selected: PipelineVM) => {
    if (this.payload.deal) {
      if (this.payload.deal.stage.pipeline.id !== selected.id) {
        console.log('a', selected);
        this.state.form.get('pipeline').setValue(selected);
        this.state.form.get('stage').setValue(selected.stages.find((stage) => stage.position === 0));
      } else {
        console.log('b', selected);
        this.state.form.get('stage').setValue(this.payload.deal.stage);
      }
    } else {
      if (selected.id !== this.payload.pipeline?.id) {
        console.log('c', selected);
        this.state.form.get('pipeline').setValue(selected);
        this.state.form.get('stage').setValue(selected.stages.find((stage) => stage.position === 0));
      }
    }
    console.log(this.state.form);
  }
  useSubmit = async (ref: NbDialogRef<any>) => {
    ref.close();
    if (this.state.form.valid) {
      this.useShowSpinner();
      const subscription = (this.payload.deal ? this.service.update({
        ...this.state.form.value,
        campaign: this.state.form.value.for === 'campaign' ? this.state.form.value.campaign : undefined,
      }) : this.service.insert({
        ...this.state.form.value,
        campaign: this.state.form.value.for === 'campaign' ? this.state.form.value.campaign : undefined,
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
      this.subscriptions.push(subscription);
    } else {
      this.state.form.markAsUntouched();
      this.state.form.markAsTouched();
    }
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
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
