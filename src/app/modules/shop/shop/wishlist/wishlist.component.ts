import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { WishListService } from 'app/services/wishlist.service';
import { CartService } from 'app/services/cart.service';
import { Observable, Subscription } from 'rxjs';
import { Product } from 'app/models/products';

@Component({
  selector: 'wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishListComponent implements OnInit, OnDestroy {
  sub: Subscription;
  wishList$: Observable<Product[]>;
  userId: string;
  header_title = 'Wishlist';

  constructor(
    private route: Router,
    private activateRoute: ActivatedRoute,
    // private wishListService: WishListService
  ) {}

  cartService = inject(CartService);

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      // const wishListItems = this.wishListService.wishListByUserId(params.id);
      // if (wishListItems) {
      //   this.wishList$ = wishListItems;
      //   this.userId = params['id'];
      // }
    });
  }

  backToHome() {
    this.route.navigate(['home']);
  }

  backToShopping() {
    this.route.navigate(['shop']);
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

  onRemoveItem(product: Product) {
    // this.wishListService.deleteWishListItemById(product.id);
  }

  addToCart(productId: string, itemId: string) {
    this.cartService.addToCartWithQuantity(productId, itemId, 1);
  }
}
