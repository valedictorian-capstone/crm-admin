import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { RoleService } from '@services';
import { RoleVM } from '@view-models';
import swal from 'sweetalert2';
@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss']
})
export class RoleCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
  form: FormGroup;
  visible = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: RoleService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      description: '',
    });
  }

  ngOnInit() {

  }

  newForm = () => {
    this.form.reset({ name: '', description: '' });
  }

  open(dialog: TemplateRef<any>) {
    this.newForm();
    this.dialogService.open(dialog, { dialogClass: 'create-modal' });
  }
  submit = (ref: NbDialogRef<any>) => {
    if (this.form.valid) {
      this.service.insert(this.form.value).subscribe(
        (data) => {
          ref.close();
          swal.fire('Notification', 'Create new role successfully!!', 'success');
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
