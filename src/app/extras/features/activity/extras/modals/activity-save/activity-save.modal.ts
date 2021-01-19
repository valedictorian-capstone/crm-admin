import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { ActivityService } from '@services';
import { ActivityAction } from '@store/actions';
import { authSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, ActivityVM, DealVM, CampaignVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';


interface IActivitySavePageState {
  you: AccountVM;
  canAssign: boolean;
  form: FormGroup;
  config: AngularEditorConfig;
  today: Date;
  min: Date;
  minStart: Date;
  minEnd: Date;
  max: Date;
  showDateStartPicker: boolean;
  showDateEndPicker: boolean;
}

interface IActivitySavePagePayload {
  activity: ActivityVM;
  time: Date;
  deal: DealVM;
  campaign: CampaignVM;
  inside: boolean;
  fix: boolean;
  for: 'campaign' | 'deal'
}

@Component({
  selector: 'app-activity-save',
  templateUrl: './activity-save.modal.html',
  styleUrls: ['./activity-save.modal.scss']
})
export class ActivitySaveModal implements OnInit, OnChanges, OnDestroy {
  @Input() payload: IActivitySavePagePayload = {
    activity: undefined,
    time: undefined,
    deal: undefined,
    campaign: undefined,
    inside: false,
    fix: false,
    for: 'deal'
  };
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<ActivityVM> = new EventEmitter<ActivityVM>();
  subscriptions: Subscription[] = [];
  state: IActivitySavePageState = {
    you: undefined,
    canAssign: false,
    form: undefined,
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
    },
    today: new Date(),
    min: new Date(),
    minStart: new Date(new Date().setDate(new Date().getDate() - 1)),
    minEnd: new Date(),
    max: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    showDateStartPicker: false,
    showDateEndPicker: false,
  }
  constructor(
    protected readonly service: ActivityService,
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
    if (this.payload.activity) {
      this.useSetData();
    } else {
      this.useInput();
    }
    if (this.payload.for) {
      this.state.form.get('for').setValue(this.payload.for);
    }
  }
  ngOnChanges() {
    this.useInput();
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          if (profile) {
            if (profile) {
              this.state.you = profile;
              this.state.canAssign = this.state.you.roles.filter((role) => role.canAssignActivity).length > 0;
            }
          }
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useSetData = () => {
    this.useShowSpinner();
    const subscription = this.service.findById(this.payload.activity.id)
      .pipe(
        tap((data) => {
          this.store.dispatch(ActivityAction.SaveSuccessAction({ res: data }));
          this.payload.activity = data;
          this.state.form.addControl('id', new FormControl(this.payload.activity.id));
          this.state.form.patchValue({
            ...this.payload.activity,
            dateEnd: new Date(this.payload.activity.dateEnd),
            dateStart: new Date(this.payload.activity.dateStart)
          });
          this.useCheckTime();
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useInput = () => {
    this.state.form.get('deal').setValue(this.payload.deal);
    this.state.form.get('campaign').setValue(this.payload.campaign);
    if (this.payload.time) {
      this.state.form.get('dateStart').setValue(this.payload.time);
      this.state.form.get('dateEnd').setValue(new Date(this.payload.time.getTime() + 86400000));
    }
    this.state.form.get('assignee').setValue(this.state.you);
  }
  useCheckTime = () => {
    this.state.min = new Date(this.state.form.get('dateStart').value);
    this.state.minEnd = new Date(this.state.form.get('dateStart').value);
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useSubmit = (ref?: NbDialogRef<any>) => {
    if (ref) {
      ref.close();
    }
    if (this.state.form.valid) {
      this.useShowSpinner();
      const subscription = (this.payload.activity ? this.service.update : this.service.insert)({
        ...this.state.form.value,
        campaign: this.state.form.value.for === 'campaign' ? this.state.form.value.campaign : undefined,
        deal: this.state.form.value.for === 'deal' ? this.state.form.value.deal : undefined,
      })
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Save activity successful!', { duration: 3000 });
            this.useDone.emit(data);
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Save activity fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        ).subscribe();
      this.subscriptions.push(subscription);
    } else {
      this.state.form.markAsUntouched();
      this.state.form.markAsTouched();
    }
  }
  useToggleDone = () => {
    this.useShowSpinner();
    const subscription = this.service.update({ id: this.payload.activity.id, status: this.payload.activity.status === 'processing' ? 'done' : 'processing' } as any)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Save activity successful!', { duration: 3000 });
          this.useDone.emit(data);
          this.useClose.emit();
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Save activity fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.useShowSpinner();
    const subscription = this.service.remove(this.payload.activity.id)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Save activity successful!', { duration: 3000 });
          this.useClose.emit();
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Remove activity fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      type: new FormControl('email', [Validators.required]),
      location: new FormControl(''),
      for: new FormControl('deal'),
      status: new FormControl('processing'),
      dateStart: new FormControl(new Date(), [Validators.required]),
      deal: new FormControl(undefined, [Validators.required]),
      campaign: new FormControl(undefined),
      dateEnd: new FormControl(new Date(new Date().getTime() + (86400000 * 30)), [Validators.required]),
      description: new FormControl(''),
      assignee: new FormControl(undefined, [Validators.required]),
    });
    this.subscriptions.push(
      this.state.form.get('for').valueChanges
        .pipe(
          tap((data) => {
            this.state.form.get('deal').setValidators([]);
            this.state.form.get('deal').setErrors(null);
            this.state.form.get('campaign').setValidators([]);
            this.state.form.get('campaign').setErrors(null);
            switch (data) {
              case 'deal':
                this.state.form.get('deal').setValidators([Validators.required]);
                break;
              case 'campaign':
                this.state.form.get('campaign').setValidators([Validators.required]);
                break;
              default:
                break;
            }
          })
        ).subscribe()
    );
  }
  useShowSpinner = () => {
    this.spinner.show('activity-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('activity-save');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
