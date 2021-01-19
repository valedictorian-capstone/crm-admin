import { Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { NoteService } from '@services';
import { CampaignVM, DealVM, NoteVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { finalize, tap, catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { NoteAction } from '@store/actions';
import { Store } from '@ngrx/store';
import { State } from '@store/states';

interface INoteSavePageState {
  form: FormGroup;
  config: AngularEditorConfig;
}

interface INoteSavePagePayload {
  note: NoteVM;
  deal: DealVM;
  campaign: CampaignVM;
  inside: boolean;
  fix: boolean;
  for: 'campaign' | 'deal'
}

@Component({
  selector: 'app-note-save',
  templateUrl: './note-save.modal.html',
  styleUrls: ['./note-save.modal.scss']
})
export class NoteSaveModal implements OnInit, OnChanges, OnDestroy {
  @Input() payload: INoteSavePagePayload = {
    note: undefined,
    deal: undefined,
    campaign: undefined,
    inside: false,
    fix: false,
    for: 'deal'
  };
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<NoteVM> = new EventEmitter<NoteVM>();
  subscriptions: Subscription[] = [];
  state: INoteSavePageState = {
    form: undefined,
    config: {
      editable: true,
      spellcheck: true,
      height: '15rem',
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
  }
  constructor(
    protected readonly service: NoteService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>,
  ) {
    this.useInitForm();
  }

  ngOnInit() {
    if (this.payload.note) {
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
  useInitForm = () => {
    this.state.form = new FormGroup({
      description: new FormControl(''),
      for: new FormControl('deal'),
      campaign: new FormControl(undefined),
      deal: new FormControl(this.payload.deal, [Validators.required]),
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
  useSetData = () => {
    this.useShowSpinner();
    const subscription = this.service.findById(this.payload.note.id)
      .pipe(
        tap((data) => {
          this.store.dispatch(NoteAction.SaveSuccessAction({ res: data }));
          this.payload.note = data;
          this.state.form.addControl('id', new FormControl(this.payload.note.id));
          this.state.form.patchValue(this.payload.note);
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
      const subscription = (this.payload.note ? this.service.update : this.service.insert)({
        ...this.state.form.value,
        campaign: this.state.form.value.for === 'campaign' ? this.state.form.value.campaign : undefined,
        deal: this.state.form.value.for === 'deal' ? this.state.form.value.deal : undefined,
      })
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Save note successful!', { duration: 3000 });
            this.useDone.emit(data);
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Save note fail! ' + err.error.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        )
        .subscribe();
      this.subscriptions.push(subscription);
    } else {
      this.state.form.markAsUntouched();
      this.state.form.markAsTouched();
    }
  }
  useShowSpinner = () => {
    this.spinner.show('note-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('note-save');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
