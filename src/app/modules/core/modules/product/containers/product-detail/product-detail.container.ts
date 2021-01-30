import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@services';
import { State } from '@store/states';
import { Store } from '@ngrx/store';
import { tap, pluck, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { authSelector } from '@store/selectors';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductAction } from '@actions';
import { IProductDetailState } from '@extras/features/product';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.container.html',
  styleUrls: ['./product-detail.container.scss']
})
export class ProductDetailContainer implements OnInit, OnDestroy {
  state: IProductDetailState = {
    id: undefined,
    main: undefined,
    you: undefined,
  }
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: ProductService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useGetId();
    this.useLoadMine();
  }

  ngOnInit() {
    this.useDispatch();
  }
  useGetId() {
    this.subscriptions.push(
      this.activatedRoute.params
        .pipe(
          pluck('id'),
          tap((id) => {
            this.state.id = id;
            this.useReload();
          })
        ).subscribe()
    );
  }
  useLoadMine() {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            if (profile) {
              this.state.you = profile;
              this.useCheckPermission();
            }
          })
        )
        .subscribe()
    );
  }
  useCheckPermission() {
    if (this.state.you) {
      this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateProduct).length > 0;
    }
  }
  useDispatch() {
    this.subscriptions.push(
      this.store.select((state) => state.product)
        .pipe(
          tap((data) => {
            const dataFind = data.entities ? data.entities[this.state.id] : undefined;
            if (!dataFind) {
              this.useReload();
            } else {
              this.state.main = dataFind;
              this.useCheckPermission();
            }
          })
        ).subscribe()
    );
  }
  useReload() {
    this.useShowSpinner();
    this.service.findById(this.state.id)
      .pipe(
        tap((res) => this.store.dispatch(ProductAction.SaveSuccessAction({ res }))),
        finalize(() => this.useHideSpinner())
      )
      .subscribe()
  }
  useShowSpinner = () => {
    this.spinner.show('product-detail');
  }
  useHideSpinner = () => {
    this.spinner.hide('product-detail');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
