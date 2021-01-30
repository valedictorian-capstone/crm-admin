import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { CampaignService } from '@services';
import { CampaignAction } from '@store/actions';
import { State } from '@store/states';
import { AccountVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, of } from 'rxjs';
import { finalize, tap, catchError } from 'rxjs/operators';
interface ICampaignSavePageState {
  you: AccountVM;
  form: FormGroup;
  showDateEndPicker: boolean;
  showDateStartPicker: boolean;
  minStart: Date;
  minEnd: Date;
  max: Date;
  config: AngularEditorConfig;
}
@Component({
  selector: 'app-campaign-save',
  templateUrl: './campaign-save.modal.html',
  styleUrls: ['./campaign-save.modal.scss']
})
export class CampaignSaveModal implements OnInit, OnDestroy {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() payload = {
    campaign: undefined,
  };
  subscriptions: Subscription[] = [];
  state: ICampaignSavePageState = {
    you: undefined,
    form: undefined,
    showDateEndPicker: false,
    showDateStartPicker: false,
    minStart: new Date(new Date().setDate(new Date().getDate() - 1)),
    minEnd: new Date(new Date().setDate(new Date().getDate() - 1)),
    max: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    config: {
      editable: true,
      spellcheck: true,
      height: '10rem',
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
    protected readonly service: CampaignService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useInitForm();
  }

  ngOnInit() {
    if (this.payload.campaign) {
      this.useSetData();
    }
  }
  useSetData = () => {
    this.useShowSpinner();
    const subscription = this.service.findById(this.payload.campaign.id)
      .pipe(
        tap((data) => {
          this.store.dispatch(CampaignAction.SaveSuccessAction({ res: data }));
          this.payload.campaign = data;
          this.state.form.addControl('id', new FormControl(this.payload.campaign.id));
          this.state.form.patchValue({
            ...this.payload.campaign,
            dateEnd: new Date(this.payload.campaign.dateEnd),
            dateStart: new Date(this.payload.campaign.dateStart),
          });
          this.useCheckTime();
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe()
    this.subscriptions.push(subscription);
  }
  useShowSpinner = () => {
    this.spinner.show('campaign-save');
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      name: new FormControl('New Campaign', [Validators.required]),
      description: new FormControl(''),
      emailTemplate: new FormControl(''),
      autoCreateDeal: new FormControl(true),
      type: new FormControl(undefined, [Validators.required]),
      status: new FormControl('planning'),
      pipeline: new FormControl(undefined, [Validators.required]),
      dateStart: new FormControl(new Date(), [Validators.required]),
      dateEnd: new FormControl(new Date(new Date().getTime() + (86400000 * 30)), [Validators.required]),
    });
  }
  useSubmit = async (ref: NbDialogRef<any>) => {
    ref.close();
    if (this.state.form.valid) {
      this.useShowSpinner();
      const subscription = (this.payload.campaign ? this.service.update({
        ...this.state.form.value,
      }) : this.service.insert({
        ...this.state.form.value,
      }))
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Save campaign successful!', { duration: 3000 });
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Save campaign fail! ' + err.error.message, { duration: 3000 });
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
  useCheckTime = () => {
    this.state.minEnd = new Date(new Date(this.state.form.get('dateStart').value).setDate(new Date(this.state.form.get('dateStart').value).getDate() - 1));
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('campaign-save');
    }, 1000);
  }
  useCheckStart() {
    return this.payload.campaign.status === 'planning';
  }
  useCheckEnd() {
    return this.payload.campaign.status === 'planning' || this.payload.campaign.status === 'active';
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
