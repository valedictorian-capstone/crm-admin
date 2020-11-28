import { Component, OnInit } from '@angular/core';
import { ProductService, GlobalService } from '@services';
import { ProductVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-main',
  templateUrl: './product-main.page.html',
  styleUrls: ['./product-main.page.scss']
})
export class ProductMainPage implements OnInit {
  products: ProductVM[] = [];
  filterProducts: ProductVM[] = [];
  search = '';
  stage = 'done';
  constructor(
    protected readonly productService: ProductService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit() {
    this.useReload();
    this.useTrigger();
  }
  useTrigger = () => {
    this.productService.triggerValue$.subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.products.push(trigger.data);
      } else if (trigger.type === 'update') {
        this.products[this.products.findIndex((e) => e.id === trigger.data.id)] = trigger.data;
      } else {
        this.products.splice(this.products.findIndex((e) => e.id === trigger.data.id), 1);
      }
      this.useFilter();
    });
  }
  useReload = () => {
    this.useShowSpinner();
    this.productService.findAll()
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe((data) => {
        this.products = data;
        this.useFilter();
      });
  }
  useFilter = () => {
    this.filterProducts = this.products.filter((e) =>
      e.name.toLowerCase().includes(this.search.toLowerCase()) ||
      e.code.toLowerCase().includes(this.search.toLowerCase())
    );
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'product', payload: {} });
  }
  useImport = () => {
    this.globalService.triggerView$.next({ type: 'import', payload: { importType: 'product' } });
  }
  useShowSpinner = () => {
    this.spinner.show('product-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('product-main');
    }, 1000);
  }
}
