import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishList } from 'app/models/wishlist';

@Component({
  selector: 'app-wishlist-card',
  templateUrl: './wishlist-card.component.html',
  styleUrls: ['./wishlist-card.component.css'],
})
export class WishlistCardComponent {
  item: WishList;
  constructor() {}
  onRemoveItem(item: string) {}
  addToCart(productId: string, itemId: string) {}
}
