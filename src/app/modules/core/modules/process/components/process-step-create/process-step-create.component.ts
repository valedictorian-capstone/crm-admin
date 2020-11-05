import { Component, OnInit, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { environment } from '@environments/environment';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ProcessStepService } from '@services';
import { DepartmentVM, ProcessStepVM, ProcessVM } from '@view-models';
import swal from 'sweetalert2';
@Component({
  selector: 'app-process-step-create',
  templateUrl: './process-step-create.component.html',
  styleUrls: ['./process-step-create.component.scss']
})
export class ProcessStepCreateComponent implements OnInit {
  @Input() departments: DepartmentVM[] = [];
  @Input() process: ProcessVM;
  @Output() useDone: EventEmitter<ProcessStepVM> = new EventEmitter<ProcessStepVM>();
  form: FormGroup;
  visible = false;
  types = environment.types;
  subTypes = [];
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: ProcessStepService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      subType: ['', [Validators.required]],
      description: '',
      process: this.process
    });
  }

  ngOnInit() {
    this.form.get('type').valueChanges.subscribe((data) => {
      this.subTypes = this.types.find((e) => e.name === data) ? this.types.find((e) => e.name === data).subTypes : [];
    });
  }

  newForm = () => {
    console.log(this.process);
    this.form.reset({ name: '', description: '', type: '', subType: '', process: { id: this.process.id } });
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
          swal.fire('Notification', 'Create new process-step successfully!!', 'success');
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
