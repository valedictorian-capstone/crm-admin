import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ProcessService } from '@services';
import { ProcessVM } from '@view-models';
import swal from 'sweetalert2';
@Component({
  selector: 'app-process-create',
  templateUrl: './process-create.component.html',
  styleUrls: ['./process-create.component.scss']
})
export class ProcessCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<ProcessVM> = new EventEmitter<ProcessVM>();
  form: FormGroup;
  visible = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: ProcessService,
  ) {
    this.form = fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: '',
    });
  }

  ngOnInit() {
    this.check('code');
  }

  newForm = () => {
    this.form.reset({ name: '', description: '' });
  }

  open(dialog: TemplateRef<any>) {
    this.newForm();
    this.dialogService.open(dialog, { dialogClass: 'create-modal' });
  }
  check = async (name: string) => {
    const control = this.form.get(name);
    control.valueChanges.subscribe(async (data) => {
      if (data !== '') {
        const value = await this.service.checkUnique(name, data).toPromise();
        let errors = control.errors;
        if (value) {
          errors = errors == null ? {} : errors;
          errors.unique = true;
        } else {
          if (errors?.unique) {
            delete errors.unique;
          }
        }
        control.setErrors(errors);
      }
    });
  }
  submit = (ref: NbDialogRef<any>) => {
    if (this.form.valid) {
      this.service.insert(this.form.value).subscribe(
        (data) => {
          ref.close();
          swal.fire('Notification', 'Create new process successfully!!', 'success');
          this.useDone.emit(data);
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
