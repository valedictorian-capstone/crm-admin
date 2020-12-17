import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { DealDetailService, DealService, ProductService } from '@services';
import { DealDetailVM, DealVM, ProductVM } from '@view-models';
import { tap } from 'rxjs/operators';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { productSelector } from '@store/selectors';
import { ProductAction } from '@store/actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-deal-product',
  templateUrl: './deal-product.component.html',
  styleUrls: ['./deal-product.component.scss']
})
export class DealProductComponent implements OnInit, OnChanges, OnDestroy {
  @Input() deal: DealVM;
  details: FormArray = new FormArray([]);
  products: ProductVM[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly dealService: DealService,
    protected readonly dealDetailService: DealDetailService,
    protected readonly toastrService: NbToastrService,
    protected readonly store: Store<State>
  ) { }
  ngOnChanges() {
    if (this.deal) {
      this.details.clear();
      this.deal.dealDetails.forEach(this.usePlusDetail);
    }
  }
  ngOnInit() {
    this.useDispatch();
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select((state) => state.product)
        .pipe(
          tap((product) => {
            const firstLoad = product.firstLoad;
            const data = (product.ids as string[]).map((id) => product.entities[id]);
            if (!firstLoad) {
              this.useReload();
            } else {
              this.products = data;
            }
          })
        ).subscribe()
    );
  }
  useReload = () => {
    this.store.dispatch(ProductAction.FindAllAction({}));
  }
  useRemoveDetail = (id: string, index: number) => {
    this.details.removeAt(index);
    if (id) {
      this.subscriptions.push(
        this.dealDetailService.remove(id).subscribe()
      );
    }
    this.toastrService.success('', 'Remove product successful!', { duration: 3000 });

  }
  usePlusDetail = (detail?: DealDetailVM) => {
    const group = new FormGroup({
      product: new FormGroup({
        id: new FormControl(detail ? detail.product.id : undefined),
        name: new FormControl(detail ? detail.product.name : undefined, [Validators.required]),
        price: new FormControl(detail ? detail.product.price : 0, [Validators.required]),
        isNew: new FormControl(detail ? false : true),
      }),
      quantity: new FormControl(detail ? detail.quantity : 1, [Validators.required]),
      deal: new FormControl({ id: this.deal.id })
    });
    if (detail) {
      group.addControl('id', new FormControl(detail.id));
    }
    this.details.push(group);
  }
  useSaveDetail = (detail: FormGroup) => {
    if (detail.valid) {
      this.subscriptions.push(
        (detail.value.id ? this.dealDetailService.update(detail.value) : this.dealDetailService.insert({
          ...detail.value,
          code: detail.value.product.name + '-' + Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
                .map((x) => x[Math.floor(Math.random() * x.length)]).join('')
        }))
          .pipe(
            tap((data) => {
              if (!detail.value.id) {
                detail.addControl('id', new FormControl(data.id));
              }
              this.toastrService.success('', 'Save product successful!', { duration: 3000 });
            })
          ).subscribe()
      );
    }
  }
  useChangeDealDetail = (product: ProductVM, group: FormGroup, isNew: boolean) => {
    group.get('id').setValue(product.id);
    group.get('name').setValue(product.name);
    group.get('price').setValue(product.price);
    group.get('isNew').setValue(isNew);
  }
  useAmount = (group: FormGroup) => {
    const price = group.get('product').get('price').value && group.get('product').get('price').value !== '' ? group.get('product').get('price').value : '0';
    const quantity = group.get('quantity').value && group.get('quantity').value !== '' ? group.get('quantity').value : '0';
    const rs = parseInt(price, 0) * parseInt(quantity, 0);
    return new Intl.NumberFormat('en', {
      minimumFractionDigits: 0
    }).format(Number(rs));
  }
  useCanDelete = () => {
    return (this.details.value as DealDetailVM[]).filter((e) => e.id != null).length > 1;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
