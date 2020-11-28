import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DealDetailService, DealService, ProductService } from '@services';
import { DealDetailVM, DealVM, ProductVM } from '@view-models';
import { tap } from 'rxjs/operators';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-deal-product',
  templateUrl: './deal-product.component.html',
  styleUrls: ['./deal-product.component.scss']
})
export class DealProductComponent implements OnInit, OnChanges {
  @Input() deal: DealVM;
  details: FormArray = new FormArray([]);
  products: ProductVM[] = [];
  constructor(
    protected readonly dealService: DealService,
    protected readonly dealDetailService: DealDetailService,
    protected readonly productService: ProductService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    if (this.deal) {
      this.details.clear();
      this.deal.dealDetails.forEach(this.usePlusDetail);
    }
  }

  ngOnInit() {
    this.productService.findAll().pipe(tap((data) => this.products = data)).subscribe();
  }
  useRemoveDetail = (id: string, index: number) => {
    this.details.removeAt(index);
    if (id) {
      this.dealDetailService.remove(id).pipe(tap(() => {
        this.dealDetailService.triggerValue$.next({ type: 'remove', data: { id, deal: this.deal } as any });
      })).subscribe();
    }
    this.toastrService.success('', 'Remove product success!', { duration: 3000 });

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
            this.dealDetailService.triggerValue$.next({ type: detail.value.id ? 'update' : 'create', data });
            this.toastrService.success('', 'Save product success!', { duration: 3000 });
          })
        ).subscribe();
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
}
