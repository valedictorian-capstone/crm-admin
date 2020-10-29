import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { RoleService } from '@services';
import { RoleVM } from '@view-models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-role-update',
  templateUrl: './role-update.component.html',
  styleUrls: ['./role-update.component.scss']
})
export class RoleUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
  @Input() role: RoleVM;
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
    this.form.reset({ name: this.role.name, description: this.role.description });
  }

  open(dialog: TemplateRef<any>) {
    this.newForm();
    this.dialogService.open(dialog, { dialogClass: 'update-modal' });
  }
  submit = (ref: NbDialogRef<any>) => {
    if (this.form.valid) {
      this.service.update({ ...this.role, ...this.form.value }).subscribe(
        () => {
          ref.close();
          swal.fire('Notification', 'Update role successfully!!', 'success');
          this.useDone.emit({ ...this.role, ...this.form.value });
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
