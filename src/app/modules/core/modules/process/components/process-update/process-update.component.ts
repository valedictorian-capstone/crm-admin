import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { ProcessService } from '@services';
import { ProcessVM } from '@view-models';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-process-update',
  templateUrl: './process-update.component.html',
  styleUrls: ['./process-update.component.scss']
})
export class ProcessUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<ProcessVM> = new EventEmitter<ProcessVM>();
  @Input() process: ProcessVM;
  form: FormGroup;
  visible = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: ProcessService,
    protected readonly router: Router,

  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      description: '',
    });
  }

  ngOnInit() {

  }

  newForm = () => {
    this.form.reset({ name: this.process.name, description: this.process.description });
  }

  open(dialog: TemplateRef<any>) {
    this.newForm();
    this.dialogService.open(dialog, { dialogClass: 'update-modal' });
  }
  submit = (ref: NbDialogRef<any>) => {
    if (this.form.valid) {
      this.service.update({ ...this.process, ...this.form.value }).subscribe(
        () => {
          ref.close();
          swal.fire('Notification', 'Update process successfully!!', 'success');
          this.useDone.emit({ ...this.process, ...this.form.value });
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
  gotoDetail = (ref: NbDialogRef<any>) => {
    this.router.navigate(['core/process/' + this.process.id]);
    ref.close();
  }
}
