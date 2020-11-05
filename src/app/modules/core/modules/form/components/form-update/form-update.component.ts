import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { FormGroupService } from '@services';
import { FormGroupVM } from '@view-models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form-group-update',
  templateUrl: './form-update.component.html',
  styleUrls: ['./form-update.component.scss']
})
export class FormUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<FormGroupVM> = new EventEmitter<FormGroupVM>();
  @Input() formView: FormGroupVM;
  form: FormGroup;
  visible = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: FormGroupService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      description: '',
    });
  }

  ngOnInit() {
  }

  newForm = () => {
    this.form.reset({ name: this.formView.name, description: this.formView.description });
  }

  open(dialog: TemplateRef<any>) {
    this.newForm();
    this.dialogService.open(dialog, { dialogClass: 'update-modal' });
  }
  submit = (ref: NbDialogRef<any>) => {
    if (this.form.valid) {
      this.service.update({ ...this.form, ...this.form.value }).subscribe(
        () => {
          ref.close();
          swal.fire('Notification', 'Update form successfully!!', 'success');
          this.useDone.emit({ ...this.form, ...this.form.value });
        },
        (error) => {
          swal.fire('Notification', 'Something wrong on runtime! Please check again', 'error');
        }
      );
    } else {
      this.form.markAsTouched();
    }
    // ref.close();
  }
}
