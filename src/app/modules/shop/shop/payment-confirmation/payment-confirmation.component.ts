import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';


import { Observable, Subscription } from 'rxjs';
import { Cart } from '../../models/cart';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/services/auth.service';
import { CheckoutService } from '../../shop-services/checkout.service';
import { CartService } from '../../shop-services/cart.service';


interface profile {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  postal_code: string;
  country: string;
  town: string;
  phone: string;
}

@Component({
  selector: 'cart',
  templateUrl: './payment-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentConfirmationComponent implements OnInit, OnDestroy {
  sub: Subscription;
  cart$: Observable<Cart[] | undefined>;
  userId: string;
  cartId: string;
  total: number;
  tax: number;
  shipping: number;
  grand_total: number;
  cartData: any;
  purchaseStarted: boolean;
  admin_login = false;
  cartItemsAvailable: boolean = false;

  constructor(
    private authService: AuthService,
    private route: Router,
    private activateRoute: ActivatedRoute,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private snack: MatSnackBar
  ) {    
      this.userId = this.authService.UserId();
  }

  ngOnInit(): void {
    this.userId = this.activateRoute.snapshot.params.id;
    this.cart$ = this.cartService.cartByStatus(this.userId, 'open');

    if (this.cart$) {
      this.calculateTotals();
    }
  }

  onCheckOut() {
    // this.calculateTotals();
    if (this.userId !== undefined && this.cartId !== undefined) {
      this.purchaseStarted = true;
      this.checkoutService
        .startProductCheckoutSession(this.cartId)
        .subscribe((checkoutSession) => {
          this.checkoutService.redirectToCheckout(checkoutSession);
        });
      this.purchaseStarted = false;
    } else {
      this.snack.open(
        'Unable to reach the payment server. Please try again in a moment.',
        'Payment Failed'
      );
      this.purchaseStarted = false;
    }
  }

  calculateTotals() {
    this.cartItemsAvailable = false;
    this.grand_total = 0.0;
    this.total = 0.0;
    this.cart$.subscribe((result) => {
      let total = 0.0;
      result.forEach((item) => {
        let pricestring = item.price;
        let price: number = +pricestring;
        total = price + total;
        this.cartId = item.id;
      });

      this.total = total;
      this.tax = Math.trunc(this.total * 0);
      this.shipping = Math.trunc(25);
      if (this.total > 500) {
        this.shipping = Math.trunc(40);
      }
      if (this.total === 0) {
        this.shipping = Math.trunc(0);
      }
      this.grand_total = this.round(this.total + this.tax + this.shipping, 2);
      if (this.grand_total > 0) {
        this.cartItemsAvailable = true;
      }
    });
  }

  round(number: number, precision: number) {
    if (precision < 0) {
      let factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    } else
      return +(
        Math.round(Number(number + 'e+' + precision)) +
        'e-' +
        precision
      );
  }

  backToShopping() {
    this.route.navigate(['shop']);
  }

  ngOnDestroy(): void {}

  onRemoveItem(item: string) {
    this.cartService.delete(this.userId, item);
    this.calculateTotals();
  }
}
