import { Component, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
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
  restores: ProductVM[] = [];
  filterProducts: ProductVM[] = [];
  search = '';
  stage = 'done';
  constructor(
    protected readonly productService: ProductService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly dialogService: NbDialogService,
  ) {
  }

  ngOnInit() {
    this.useReload();
    this.useSocket();
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useSocket = () => {
    this.productService.triggerSocket().subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.products.push(((trigger.data as ProductVM) as ProductVM));
      } else if (trigger.type === 'update') {
        const pro = this.restores.find((e) => e.id === ((trigger.data as ProductVM) as ProductVM).id);
        if (pro) {
          if ((trigger.data as ProductVM).isDelete) {
            this.restores[this.restores.findIndex((e) => e.id === (trigger.data as ProductVM).id)] = (trigger.data as ProductVM);
          } else {
            this.restores.splice(this.restores.findIndex((e) => e.id === (trigger.data as ProductVM).id), 1);
          }
        }
        this.products[this.products.findIndex((e) => e.id === (trigger.data as ProductVM).id)] = (trigger.data as ProductVM);
      } else if (trigger.type === 'remove') {
        this.products.splice(this.products.findIndex((e) => e.id === (trigger.data as ProductVM).id), 1);
        this.restores.push((trigger.data as ProductVM));
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
        this.products = data.filter((product) => !product.isDelete);
        this.restores = data.filter((product) => product.isDelete);
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
  useRestore = (p: ProductVM) => {
    this.products.push(p);
    this.restores = this.restores.filter((product) => product.id !== p.id);
  }
}
