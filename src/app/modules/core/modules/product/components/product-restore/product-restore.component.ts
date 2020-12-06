import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ProductService } from '@services';
import { ProductVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-restore',
  templateUrl: './product-restore.component.html',
  styleUrls: ['./product-restore.component.scss']
})
export class ProductRestoreComponent implements OnInit {
  @Output() useDone: EventEmitter<ProductVM> = new EventEmitter<ProductVM>();
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() products: ProductVM[] = [];
  constructor(
    protected readonly productService: ProductService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly toastrService: NbToastrService,
  ) { }

  ngOnInit() {
  }

  useRestore = (id: string) => {
    this.useShowSpinner();
    this.productService.restore(id)
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      ).subscribe((data) => {
        this.useDone.emit(data);
        this.products = this.products.filter((product) => product.id !== id);
        if (this.products.length === 0) {
          this.useClose.emit();
        }
        this.toastrService.success('', 'Restore product successful', { duration: 3000 });
      }, () => {
        this.toastrService.success('', 'Restore product fail', { duration: 3000 });
      });

  }

  useShowSpinner = () => {
    this.spinner.show('product-restore');
  }
  useHideSpinner = () => {
    this.spinner.hide('product-restore');
  }
}
