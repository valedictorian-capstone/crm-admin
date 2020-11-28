import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { ActivityService } from '@services';
import { ActivityVM, DealVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reuse-activity-save',
  templateUrl: './activity-save.page.html',
  styleUrls: ['./activity-save.page.scss']
})
export class ActivitySavePage implements OnInit, OnChanges {
  @Input() activity: ActivityVM;
  @Input() time: Date;
  @Input() deal: DealVM;
  @Input() inside: boolean;
  @Input() fixDeal = false;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<ActivityVM> = new EventEmitter<ActivityVM>();
  form: FormGroup;
  today = new Date();
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
    protected readonly activityService: ActivityService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useShowSpinner();
    this.useInitForm();
  }
  ngOnInit() {
    if (this.activity) {
      this.useSetData();
    } else {
      this.useInput();
    }
    this.useHideSpinner();
  }
  ngOnChanges() {
    this.useInput();
  }
  useSetData = () => {
    this.activityService.findById(this.activity.id).subscribe((data) => {
      this.activity = data;
      this.form.addControl('id', new FormControl(this.activity.id));
      this.form.patchValue({
        ...this.activity,
        dateEnd: new Date(this.activity.dateEnd),
        dateStart: new Date(this.activity.dateStart)
      });
    });
  }
  useInput = () => {
    if (this.fixDeal && this.deal) {
      this.form.get('deal').setValue(this.deal);
    }
    if (this.time) {
      this.form.get('dateStart').setValue(this.time);
      this.form.get('dateEnd').setValue(new Date(this.time.getTime() + 86400000));
    }
  }
  toDateFormat = (date: Date) => {
    return date ? this.datePipe.transform(new Date(date), 'HH:mm dd/MM/yyyy') : '';
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
        (this.activity ? this.activityService.update(this.form.value) : this.activityService.insert(this.form.value))
          .pipe(
            finalize(() => {
              this.useHideSpinner();
            })
          )
          .subscribe((data) => {
            this.activityService.triggerValue$.next({ type: this.activity ? 'update' : 'create', data });
            this.toastrService.success('', 'Save activity success!', { duration: 3000 });
            this.useDone.emit(data);
            this.useClose.emit();
          }, (err) => {
            this.toastrService.danger('', 'Save activity fail! Something wrong at runtime', { duration: 3000 });
          });
      }, 2000);
    } else {
      this.form.markAsUntouched();
      this.form.markAsTouched();
    }
  }
  useToggleDone = () => {
    this.activityService.update({
      id: this.activity.id,
      status: this.activity.status === 'processing' ? 'done' : 'processing'
    } as any).subscribe((data) => {
      this.activityService.triggerValue$.next({ type: 'update', data });
      this.toastrService.success('', 'Save activity success!', { duration: 3000 });
      this.useDone.emit(data);
      this.useClose.emit();
    });
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.activityService.remove(this.activity.id).subscribe(() => {
      this.activityService.triggerValue$.next({ type: 'remove', data: this.activity });
      this.toastrService.success('', 'Remove activity success!', { duration: 3000 });
      this.useClose.emit();
    });
  }
  useInitForm = () => {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      type: new FormControl('email', [Validators.required]),
      location: new FormControl(''),
      status: new FormControl('processing'),
      dateStart: new FormControl(new Date(), [Validators.required]),
      deal: new FormControl(this.deal, [Validators.required]),
      dateEnd: new FormControl(new Date(new Date().getTime() + 86400000), [Validators.required]),
      description: new FormControl(''),
      assignee: new FormControl(undefined, [Validators.required]),
    },
      {
        validators: (group: FormGroup) => {
          const start = group.get('dateStart').value;
          const end = group.get('dateEnd').value;
          group.get('dateEnd').setErrors(start < end ? null : { than: true });
          return start < end ? null : { than: true };
        }
      });
  }
  useShowSpinner = () => {
    this.spinner.show('activity-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('activity-save');
    }, 1000);
  }
}
