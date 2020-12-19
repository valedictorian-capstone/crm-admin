import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { EventService } from '@services';
import { EventAction, GroupAction } from '@store/actions';
import { groupSelector } from '@store/selectors';
import { State } from '@store/states';
import { EventVM, GroupVM, TriggerVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

interface IEventSavePageState {
  form: FormGroup;
  today: Date;
  errorImage: boolean;
  message: string;
  groups: GroupVM[];
  showDateStartPicker: boolean;
  showDateEndPicker: boolean;
  canDelete: boolean;
  config: AngularEditorConfig;
  min: Date;
  minEnd: Date;
  max: Date;
}
@Component({
  selector: 'app-reuse-event-save',
  templateUrl: './event-save.page.html',
  styleUrls: ['./event-save.page.scss']
})
export class EventSavePage implements OnInit, OnChanges, OnDestroy {
  @Input() payload: { event: EventVM, time: Date } = {
    event: undefined,
    time: undefined,
  };
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<EventVM> = new EventEmitter<EventVM>();
  subscriptions: Subscription[] = [];
  state: IEventSavePageState = {
    form: undefined,
    today: new Date(),
    groups: [],
    showDateStartPicker: false,
    showDateEndPicker: false,
    canDelete: false,
    errorImage: false,
    message: '',
    min: new Date(),
    minEnd: new Date(new Date().setDate(new Date().getDate() + 1)),
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
  }
  constructor(
    protected readonly service: EventService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useInitForm();
  }
  ngOnInit() {
    this.useDispatch();
  }
  ngOnChanges() {
    this.useInput();
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select((state) => state.group)
        .pipe(
          tap((group) => {
            const firstLoad = group.firstLoad;
            const data = (group.ids as string[]).map((id) => group.entities[id]);
            if (!firstLoad) {
              this.useShowSpinner();
              this.store.dispatch(GroupAction.FindAllAction({
                finalize: () => {
                  this.useHideSpinner();
                }
              }));
            } else {
              this.state.groups = data;;
              if (this.payload.event) {
                this.useSetData();
              } else {
                this.useInput();
              }
            }
          })
        ).subscribe()
    );
  }
  useSetData = () => {
    this.useShowSpinner();
    const subscription = this.service.findById(this.payload.event.id)
      .pipe(
        tap((data) => {
          this.store.dispatch(EventAction.SaveSuccessAction({ res: data }));
          this.payload.event = data;
          this.state.form.addControl('id', new FormControl(this.payload.event.id));
          this.state.form.patchValue({
            ...this.payload.event,
            dateEnd: new Date(this.payload.event.dateEnd),
            dateStart: new Date(this.payload.event.dateStart),
            groups: this.payload.event.groups.map((e) => e.id),
          });
          (this.state.form.get('triggers') as FormArray).clear();
          const triggers = this.payload.event.triggers;
          for (let i = 0; i < triggers.length; i++) {
            const trigger = triggers[i];
            this.useAddTrigger(trigger)
          }
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
    if (this.payload.time) {
      this.state.form.get('dateStart').setValue(this.payload.time);
      this.state.form.get('dateEnd').setValue(new Date(this.payload.time.getTime() + 86400000));
    }
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
      const subscription = this.service.save({
        ...this.state.form.value,
        triggers: (this.state.form.value.triggers as TriggerVM[]).map((e) => ({ ...e, id: e.id != null ? e.id : undefined })),
        groups: (this.state.form.value.groups as GroupVM[]).map((e) => ({ id: e }))
      })
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Save event successful!', { duration: 3000 });
            this.useDone.emit(data);
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Save event fail! ' + err.error.message, { duration: 3000 });
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
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.useShowSpinner();
    const subscription = this.service.remove(this.payload.event.id)
      .pipe(
        tap(() => {
          this.toastrService.success('', 'Remove event successful!', { duration: 3000 });
          this.useClose.emit();
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Remove event fail! ' + err.error.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      dateStart: new FormControl(new Date(), [Validators.required]),
      dateEnd: new FormControl(new Date(new Date().getTime() + (86400000 * 30)), [Validators.required]),
      image: new FormControl(undefined),
      description: new FormControl(''),
      groups: new FormControl([]),
      triggers: new FormArray([]),
    });
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
  useCheckTime = () => {
    this.state.min = new Date(this.state.form.get('dateStart').value);
    this.state.minEnd = new Date(new Date(this.state.form.get('dateStart').value).setDate(new Date(this.state.form.get('dateStart').value).getDate() + 5));
    (this.state.form.get('triggers') as FormArray).controls.forEach((trigger) => {
      const time = trigger.get('time');
      if (time.value > this.state.form.get('dateEnd').value || time.value < this.state.form.get('dateStart').value) {
        time.setErrors({ notAccept: true });
        time.markAsTouched();
      }
    })
  }
  useShowSpinner = () => {
    this.spinner.show('event-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('event-save');
    }, 1000);
  }
  useAddTrigger = (trigger?: TriggerVM) => {
    (this.state.form.get('triggers') as FormArray).push(new FormGroup({
      id: new FormControl(trigger?.id),
      time: new FormControl(trigger ? new Date(trigger.time) : new Date(this.state.form.get('dateStart').value)),
      showTime: new FormControl(false),
    }));
  }
  useRemoveTrigger = (index: number) => {
    (this.state.form.get('triggers') as FormArray).removeAt(index);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
