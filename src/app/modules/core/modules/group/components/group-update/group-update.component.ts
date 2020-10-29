import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { GroupService } from '@services';
import { GroupVM } from '@view-models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-group-update',
  templateUrl: './group-update.component.html',
  styleUrls: ['./group-update.component.scss']
})
export class GroupUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<GroupVM> = new EventEmitter<GroupVM>();
  @Input() group: GroupVM;
  form: FormGroup;
  visible = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: GroupService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      description: '',
    });
  }

  ngOnInit() {

  }

  newForm = () => {
    this.form.reset({ name: this.group.name, description: this.group.description });
  }

  open(dialog: TemplateRef<any>) {
    this.newForm();
    this.dialogService.open(dialog, { dialogClass: 'update-modal' });
  }
  submit = (ref: NbDialogRef<any>) => {
    if (this.form.valid) {
      this.service.update({ ...this.group, ...this.form.value }).subscribe(
        () => {
          ref.close();
          swal.fire('Notification', 'Update group successfully!!', 'success');
          this.useDone.emit({ ...this.group, ...this.form.value });
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
