import { Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { NoteService } from '@services';
import { DealVM, NoteVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-reuse-note-save',
  templateUrl: './note-save.page.html',
  styleUrls: ['./note-save.page.scss']
})
export class NoteSavePage implements OnInit, OnChanges {
  @Input() note: NoteVM;
  @Input() deal: DealVM;
  @Input() inside: boolean;
  @Input() fixDeal = false;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<NoteVM> = new EventEmitter<NoteVM>();
  form: FormGroup;
  config: AngularEditorConfig = {
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
  };
  constructor(
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly noteService: NoteService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useShowSpinner();
    this.useInitForm();
  }

  ngOnInit() {
    if (this.note) {
      this.useSetData();
    } else {
      this.useInput();
    }
    this.useHideSpinner();
  }
  ngOnChanges() {
    this.useInput();
  }
  useInitForm = () => {
    this.form = new FormGroup({
      description: new FormControl(''),
      deal: new FormControl(this.deal, [Validators.required]),
    });
  }
  useSetData = () => {
    this.noteService.findById(this.note.id).subscribe((data) => {
      this.note = data;
      this.form.addControl('id', new FormControl(this.note.id));
      this.form.patchValue(this.note);
    });
  }
  useInput = () => {
    if (this.fixDeal && this.deal) {
      this.form.get('deal').setValue(this.deal);
    }
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
        (this.note ? this.noteService.update(this.form.value) : this.noteService.insert(this.form.value))
          .pipe(
            finalize(() => {
              this.useHideSpinner();
            })
          )
          .subscribe((data) => {
            this.toastrService.success('', 'Save note successful!', { duration: 3000 });
            this.useDone.emit(data);
            this.useClose.emit();
          }, (err) => {
            this.toastrService.danger('', 'Save note fail! Something wrong at runtime', { duration: 3000 });
          });
      }, 2000);
    } else {
      this.form.markAsUntouched();
      this.form.markAsTouched();
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
}
