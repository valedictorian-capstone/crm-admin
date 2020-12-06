import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { AuthService, CommentService, GlobalService, ProductService, TicketService } from '@services';
import { CommentVM, ProductVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Socket } from 'ngx-socket-io';
import { NgxSpinnerService } from 'ngx-spinner';
import { pluck, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss']
})
export class ProductDetailPage implements OnInit {
  product: ProductVM;
  comments: CommentVM[] = [];
  description = '';
  oneStart = {
    percent: 0,
    quantity: 0,
  };
  twoStart = {
    percent: 0,
    quantity: 0,
  };
  threeStart = {
    percent: 0,
    quantity: 0,
  };
  fourStart = {
    percent: 0,
    quantity: 0,
  };
  fiveStart = {
    percent: 0,
    quantity: 0,
  };
  totalRating = 0;
  message = '';
  rate = 5;
  constructor(
    protected readonly productService: ProductService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly spinner: NgxSpinnerService,
    protected readonly globalService: GlobalService,
    protected readonly authService: AuthService,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly dialogService: NbDialogService,
    protected readonly ticketService: TicketService,
    protected readonly commentService: CommentService,
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
    protected readonly socket: Socket,
  ) { }

  ngOnInit() {
    this.useShowSpinner();
    this.activatedRoute.params.pipe(
      pluck('id'),
      switchMap((id) => this.productService.findById(id)),
      tap((data) => {
        this.product = data;
      }),
      switchMap((data) => this.commentService.findAll(data.id)),
      tap((data) => {
        this.comments = data.sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1);
        this.useSetStar();
        this.useSocket();
        this.useHideSpinner();
      }),
    ).subscribe();
  }
  useSocket = () => {
    this.productService.triggerSocket().subscribe((trigger) => {
      if (trigger.type === 'remove') {
        this.router.navigate(['core/product']);
      } else if (trigger.type === 'update') {
        this.product = trigger.data as ProductVM;
      }
    });
    this.commentService.triggerSocket(this.product.id).subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.comments.push((trigger.data as CommentVM));
      } else if (trigger.type === 'update') {
        this.comments[this.comments.findIndex((e) => e.id === (trigger.data as CommentVM).id)] = (trigger.data as CommentVM);
      } else if (trigger.type === 'remove') {
        this.comments.splice(this.comments.findIndex((e) => e.id === (trigger.data as CommentVM).id), 1);
      }
      this.useSetStar();
    });
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
    if (this.comments.length > 0) {
      this.oneStart = {
        percent: parseInt((this.comments.filter((e) => e.rating === 1).length * 100 / this.comments.length).toFixed(0), 0),
        quantity: this.comments.filter((e) => e.rating === 1).length
      };
      this.twoStart = {
        percent: parseInt((this.comments.filter((e) => e.rating === 2).length * 100 / this.comments.length).toFixed(0), 0),
        quantity: this.comments.filter((e) => e.rating === 2).length
      };
      this.threeStart = {
        percent: parseInt((this.comments.filter((e) => e.rating === 3).length * 100 / this.comments.length).toFixed(0), 0),
        quantity: this.comments.filter((e) => e.rating === 3).length
      };
      this.fourStart = {
        percent: parseInt((this.comments.filter((e) => e.rating === 4).length * 100 / this.comments.length).toFixed(0), 0),
        quantity: this.comments.filter((e) => e.rating === 4).length
      };
      this.fiveStart = {
        percent: parseInt((this.comments.filter((e) => e.rating === 5).length * 100 / this.comments.length).toFixed(0), 0),
        quantity: this.comments.filter((e) => e.rating === 5).length
      };
      const calculate = ((
        (1 * this.comments.filter((e) => e.rating === 1).length) +
        (2 * this.comments.filter((e) => e.rating === 2).length) +
        (3 * this.comments.filter((e) => e.rating === 3).length) +
        (4 * this.comments.filter((e) => e.rating === 4).length) +
        (5 * this.comments.filter((e) => e.rating === 5).length)
      ) / this.comments.length).toFixed(2);
      this.totalRating = parseInt(calculate, 0);
      this.formatRating = () => calculate;
    }
  }
  formatRating = () => '0';
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'product', payload: { product: this.product } });
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.productService.remove(this.product.id).subscribe(() => {
      this.toastrService.success('', 'Remove product successful', { duration: 3000 });
    }, () => {
      this.toastrService.success('', 'Remove product fail', { duration: 3000 });
    });
  }
  useDetail = () => {
    this.router.navigate(['core/product/' + this.product.id]);
  }
}
