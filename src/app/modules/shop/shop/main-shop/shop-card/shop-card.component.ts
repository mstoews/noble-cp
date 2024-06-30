import {
  Component,
  Input,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { Product } from '../../../models/products'
import { Router } from '@angular/router';

@Component({
  selector: 'shop-card',
  templateUrl: './shop-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopCardComponent {
  @Input() product: Product;

  router = inject(Router);

  openProductDetail() {
    this.router.navigate(['shop/product', this.product.id]);
  }
}
