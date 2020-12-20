import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { CommentService, GlobalService, ProductService, TicketService } from '@services';
import { AccountVM, CommentVM, ProductVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Socket } from 'ngx-socket-io';
import { NgxSpinnerService } from 'ngx-spinner';
import { pluck, switchMap, tap, catchError, map } from 'rxjs/operators';
import { State } from '@store/states';
import { Store } from '@ngrx/store';
import { authSelector, commentSelector, productSelector } from '@store/selectors';
import { Subscription, of } from 'rxjs';
import { ProductAction, CommentAction } from '@store/actions';

interface IProductDetailPageState {
  id: string;
  product: ProductVM;
  comments: CommentVM[];
  description: string;
  oneStart: {
    percent: number,
    quantity: number,
  };
  twoStart: {
    percent: number,
    quantity: number,
  };
  threeStart: {
    percent: number,
    quantity: number,
  };
  fourStart: {
    percent: number,
    quantity: number,
  };
  fiveStart: {
    percent: number,
    quantity: number,
  };
  totalRating: number;
  message: string;
  rate: number;
  you: AccountVM;
  canUpdate: boolean;
  canRemove: boolean;
}
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss']
})
export class ProductDetailPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  state: IProductDetailPageState = {
    id: undefined,
    product: undefined,
    comments: [],
    description: '',
    oneStart: {
      percent: 0,
      quantity: 0,
    },
    twoStart: {
      percent: 0,
      quantity: 0,
    },
    threeStart: {
      percent: 0,
      quantity: 0,
    },
    fourStart: {
      percent: 0,
      quantity: 0,
    },
    fiveStart: {
      percent: 0,
      quantity: 0,
    },
    totalRating: 0,
    message: '',
    rate: 5,
    you: undefined,
    canUpdate: false,
    canRemove: false,
  }
  constructor(
    protected readonly service: ProductService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly spinner: NgxSpinnerService,
    protected readonly globalService: GlobalService,
    protected readonly dialogService: NbDialogService,
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
    protected readonly socket: Socket,
    protected readonly store: Store<State>
  ) {
    const subscription = this.activatedRoute.params.pipe(
      pluck('id'),
      tap((id) => {
        this.state.id = id;
      })
    ).subscribe();
    this.subscriptions.push(subscription);
    this.useLoadMine();
  }

  ngOnInit() {
    this.useDispatchProduct();
    this.useDispatchComment();
  }
  useDispatchProduct = () => {
    const subscription = this.store.select((state) => state.product)
      .pipe(
        tap((product) => {
          const firstLoad = product.firstLoad;
          const data = (product.ids as string[]).map((id) => product.entities[id]);
          if (!firstLoad) {
            this.useReloadProduct();
          } else {
            this.state.product = data.find((product) => product.id === this.state.id);
            if (!this.state.product) {
              this.router.navigate(['core/product']);
            }
          }
        })
      ).subscribe()
    this.subscriptions.push(subscription);

  }
  useDispatchComment = () => {
    const subscription = this.store.select((state) => state.comment)
      .pipe(
        tap((comment) => {
          const firstLoad = comment.firstLoad;
          const data = (comment.ids as string[]).map((id) => comment.entities[id]);
          if (!firstLoad) {
            this.useReloadComment();
          } else {
            this.state.comments = data.filter((comment) => comment.product.id === this.state.id).sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1);
            this.useSetStar();
          }
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useReloadProduct = () => {
    this.useShowSpinner();
    this.store.dispatch(ProductAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useReloadComment = () => {
    this.useShowSpinner();
    this.store.dispatch(CommentAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useShowSpinner = () => {
    this.spinner.show('product-detail');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('product-detail');
    }, 1000);
  }
  useSetStar = () => {
    if (this.state.comments.length > 0) {
      this.state.oneStart = {
        percent: parseInt((this.state.comments.filter((e) => e.rating === 1).length * 100 / this.state.comments.length).toFixed(0), 0),
        quantity: this.state.comments.filter((e) => e.rating === 1).length
      };
      this.state.twoStart = {
        percent: parseInt((this.state.comments.filter((e) => e.rating === 2).length * 100 / this.state.comments.length).toFixed(0), 0),
        quantity: this.state.comments.filter((e) => e.rating === 2).length
      };
      this.state.threeStart = {
        percent: parseInt((this.state.comments.filter((e) => e.rating === 3).length * 100 / this.state.comments.length).toFixed(0), 0),
        quantity: this.state.comments.filter((e) => e.rating === 3).length
      };
      this.state.fourStart = {
        percent: parseInt((this.state.comments.filter((e) => e.rating === 4).length * 100 / this.state.comments.length).toFixed(0), 0),
        quantity: this.state.comments.filter((e) => e.rating === 4).length
      };
      this.state.fiveStart = {
        percent: parseInt((this.state.comments.filter((e) => e.rating === 5).length * 100 / this.state.comments.length).toFixed(0), 0),
        quantity: this.state.comments.filter((e) => e.rating === 5).length
      };
      const calculate = ((
        (1 * this.state.comments.filter((e) => e.rating === 1).length) +
        (2 * this.state.comments.filter((e) => e.rating === 2).length) +
        (3 * this.state.comments.filter((e) => e.rating === 3).length) +
        (4 * this.state.comments.filter((e) => e.rating === 4).length) +
        (5 * this.state.comments.filter((e) => e.rating === 5).length)
      ) / this.state.comments.length).toFixed(2);
      this.state.totalRating = parseInt(calculate, 0);
      this.formatRating = () => calculate;
    }
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          if (profile) {
            this.state.you = profile;
            this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateProduct).length > 0;
            this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveProduct).length > 0;
          }
        })
      )
      .subscribe()
    this.subscriptions.push(subscription);
  }
  formatRating = () => '0';
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'product', payload: { product: this.state.product } });
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    const subscription = this.service.remove(this.state.product.id)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Remove product successful', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.success('', 'Remove product fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        }),
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useBack = () => {
    this.router.navigate(['core/product']);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
