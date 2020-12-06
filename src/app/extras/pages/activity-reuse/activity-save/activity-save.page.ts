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
      switch (this.activity.type) {
        case 'email':
          this.useSetValidatorEmail();
          break;
        case 'call':
          this.useSetValidatorPhone();
          break;
        default:
          this.useSetValidatorNormal();
          break;
      }
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
  useCheckTime = () => {
    const start = this.form.get('dateStart');
    const end = this.form.get('dateEnd');
    if (new Date(start.value) >= new Date(end.value)) {
      this.form.get('dateEnd').setErrors({ than: true });
      this.form.get('dateEnd').markAsTouched();
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
        (this.activity ? this.activityService.update(this.form.value) : this.activityService.insert(this.form.value))
          .pipe(
            finalize(() => {
              this.useHideSpinner();
            })
          )
          .subscribe((data) => {
            this.toastrService.success('', 'Save activity successful!', { duration: 3000 });
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
      this.toastrService.success('', 'Save activity successful!', { duration: 3000 });
      this.useDone.emit(data);
      this.useClose.emit();
    }, (err) => {
      this.toastrService.danger('', 'Save activity fail!', { duration: 3000 });
    });
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.useShowSpinner();
    this.activityService.remove(this.activity.id)
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe(() => {
        this.toastrService.success('', 'Remove activity successful!', { duration: 3000 });
        this.useClose.emit();
      }, (err) => {
        this.toastrService.danger('', 'Remove activity fail!', { duration: 3000 });
      });
  }
  useInitForm = () => {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.email]),
      type: new FormControl('email', [Validators.required]),
      location: new FormControl(''),
      status: new FormControl('processing'),
      dateStart: new FormControl(new Date(), [Validators.required]),
      deal: new FormControl(this.deal, [Validators.required]),
      dateEnd: new FormControl(new Date(new Date().getTime() + 86400000), [Validators.required]),
      description: new FormControl(''),
      assignee: new FormControl(undefined, [Validators.required]),
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
  useSetValidatorEmail = () => {
    this.form.get('name').setValidators([Validators.required, Validators.email]);
    this.form.get('name').markAsTouched();
    if (this.activity && this.activity.type === 'email') {
      this.form.get('name').setValue(this.activity.name);
    } else {
      this.form.get('name').setValue('');
    }
  }
  useSetValidatorPhone = () => {
    this.form.get('name').setValidators([Validators.required,
    Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]);
    this.form.get('name').markAsTouched();
    if (this.activity && this.activity.type === 'call') {
      this.form.get('name').setValue(this.activity.name);
    } else {
      this.form.get('name').setValue('');
    }
  }
  useSetValidatorNormal = () => {
    this.form.get('name').setValidators([Validators.required]);
    this.form.get('name').markAsTouched();
    if (this.activity && this.activity.type !== 'email' && this.activity.type !== 'call') {
      this.form.get('name').setValue(this.activity.name);
    } else {
      this.form.get('name').setValue('');
    }
  }
}
