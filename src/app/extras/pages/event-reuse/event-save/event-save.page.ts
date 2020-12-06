import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { EventService, GroupService } from '@services';
import { EventVM, GroupVM, TriggerVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-reuse-event-save',
  templateUrl: './event-save.page.html',
  styleUrls: ['./event-save.page.scss']
})
export class EventSavePage implements OnInit, OnChanges {
  @Input() event: EventVM;
  @Input() time: Date;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<EventVM> = new EventEmitter<EventVM>();
  form: FormGroup;
  today = new Date();
  groups: GroupVM[] = [];
  showDateStartPicker = false;
  showDateEndPicker = false;
  config: AngularEditorConfig = {
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
  };
  constructor(
    protected readonly datePipe: DatePipe,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly groupService: GroupService,
    protected readonly eventService: EventService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useShowSpinner();
    this.useInitForm();
  }
  ngOnInit() {
    this.useLoadGroup();
    if (this.event) {
      this.useSetData();
    } else {
      this.useInput();
    }
    this.useHideSpinner();
  }
  ngOnChanges() {
    this.useInput();
  }
  useLoadGroup = () => {
    this.groupService.findAll().pipe(tap((data) => this.groups = data)).subscribe();
  }
  useSetData = () => {
    this.eventService.findById(this.event.id).subscribe((data) => {
      this.event = data;
      this.form.addControl('id', new FormControl(this.event.id));
      this.form.patchValue({
        ...this.event,
        dateEnd: new Date(this.event.dateEnd),
        dateStart: new Date(this.event.dateStart),
        groups: this.event.groups.map((e) => e.id),
      });
      this.event.triggers.sort((a, b) => new Date(a.time) < new Date(b.time) ? -1 : 1).forEach((trigger) => this.useAddTrigger(trigger));
    });
  }
  useInput = () => {
    if (this.time) {
      this.form.get('dateStart').setValue(this.time);
      this.form.get('dateEnd').setValue(new Date(this.time.getTime() + 86400000));
    }
  }
  toDateFormat = (date: Date | string) => {
    return date && !isNaN(Date.parse(date as string)) ? this.datePipe.transform(new Date(date), 'HH:mm dd/MM/yyyy') : '';
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useSubmit = (ref?: NbDialogRef<any>) => {
    if (ref) {
      ref.close();
    }
    if (this.form.valid) {
      this.useShowSpinner();
      setTimeout(() => {
        this.eventService.save({
          ...this.form.value,
          triggers: (this.form.value.triggers as TriggerVM[]).map((e) => ({ ...e, id: e.id != null ? e.id : undefined })),
          groups: (this.form.value.groups as GroupVM[]).map((e) => ({ id: e }))
        })
          .pipe(
            finalize(() => {
              this.useHideSpinner();
            })
          )
          .subscribe((data) => {
            this.toastrService.success('', 'Save event successful!', { duration: 3000 });
            this.useDone.emit(data);
            this.useClose.emit();
          }, (err) => {
            this.toastrService.danger('', 'Save event fail! Something wrong at runtime', { duration: 3000 });
          });
      }, 2000);
    } else {
      this.form.markAsUntouched();
      this.form.markAsTouched();
    }
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.useShowSpinner();
    this.eventService.remove(this.event.id)
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe(() => {
        this.toastrService.success('', 'Remove event successful!', { duration: 3000 });
        this.useClose.emit();
      });
  }
  useInitForm = () => {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      dateStart: new FormControl(new Date(), [Validators.required]),
      dateEnd: new FormControl(new Date(new Date().getTime() + 86400000), [Validators.required]),
      description: new FormControl(''),
      groups: new FormControl([]),
      triggers: new FormArray([]),
    });
  }
  useCheckTime = () => {
    const start = this.form.get('dateStart');
    const end = this.form.get('dateEnd');
    if (new Date(start.value) >= new Date(end.value)) {
      this.form.get('dateEnd').setErrors({ than: true });
      this.form.get('dateEnd').markAsTouched();
    }
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
    (this.form.get('triggers') as FormArray).push(new FormGroup({
      id: new FormControl(trigger?.id),
      time: new FormControl(trigger ? new Date(trigger.time) : new Date()),
      showTime: new FormControl(false),
    }));
  }
  useRemoveTrigger = (index: number) => {
    (this.form.get('triggers') as FormArray).removeAt(index);
  }
}
