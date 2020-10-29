import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { GroupService } from '@services';
import { GroupVM } from '@view-models';
import swal from 'sweetalert2';
@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.scss']
})
export class GroupCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<GroupVM> = new EventEmitter<GroupVM>();
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
          swal.fire('Notification', 'Create new group successfully!!', 'success');
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
