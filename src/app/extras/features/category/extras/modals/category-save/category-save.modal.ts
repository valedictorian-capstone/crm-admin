import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { CategoryService, DealService, StageService } from '@services';
import { CategoryAction } from '@store/actions';
import { State } from '@store/states';
import { CategoryVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

interface ICategorySavePageState {
  name: FormControl;
}
interface ICategorySavePagePayload {
  category: CategoryVM;
}

@Component({
  selector: 'app-category-save',
  templateUrl: './category-save.modal.html',
  styleUrls: ['./category-save.modal.scss']
})
export class CategorySaveModal implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() payload: ICategorySavePagePayload = {
    category: undefined,
  };
  subscriptions: Subscription[] = [];
  state: ICategorySavePageState = {
    name: undefined
  };

  constructor(
    protected readonly service: CategoryService,
    protected readonly dealService: DealService,
    protected readonly stageService: StageService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useInitForm();
  }
  ngOnInit() {
    if (this.payload.category) {
      this.useSetData();
    }
  }
  useInitForm() {
    this.state.name = new FormControl('', [Validators.required]);
  }
  useSetData() {
    this.useShowSpinner();
    const subscription = this.service.findById(this.payload.category.id)
      .pipe(
        tap((data) => {
          this.payload.category = data;
          this.state.name.setValue(data.name);
          this.store.dispatch(CategoryAction.SaveSuccessAction({ res: data }));
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe()
    this.subscriptions.push(subscription);
  }
  useSubmit = async (ref: NbDialogRef<any>) => {
    ref.close();
    if (this.state.name.valid) {
      this.useShowSpinner();
      const subscription = (this.payload.category ? this.service.insert : this.service.update)({
        id: this.payload.category?.id,
        name: this.state.name.value,
      } as any)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Save category successful!', { duration: 3000 });
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Save category fail! ' + err.error.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        ).subscribe()
      this.subscriptions.push(subscription);
    } else {
      this.state.name.markAsUntouched();
    }
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useShowSpinner() {
    this.spinner.show('category-save');
  }
  useHideSpinner() {
    setTimeout(() => {
      this.spinner.hide('category-save');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
