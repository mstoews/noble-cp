import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'app/modules/shop/models/category';


@Component({
  selector: 'app-shop-landing-card',
  templateUrl: './shop-landing-card.component.html',
})
export class ShopLandingCardComponent {
  @Input() category: Category;

  constructor(private route: Router) {}

  openShopByCategory() {
    this.route.navigate(['shop/category', this.category.name]);
  }
}
