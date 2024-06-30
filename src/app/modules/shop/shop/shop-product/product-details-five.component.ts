import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
// import { WishListService } from 'app/services/wishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageItemIndex } from 'app/models/imageItem';
import { ImageItemIndexService } from 'app/services/image-item-index.service';
import { Lightbox, initTE } from 'tw-elements';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { on } from 'events';
import { Product } from '../../models/products';
import { Cart } from '../../models/cart';
import { CartService } from '../../shop-services/cart.service';
import { MenuToggleService } from '../../shop-services/menu-toggle.service';

@Component({
  selector: 'app-product-details-five',
  templateUrl: './product-details-five.component.html',
  styleUrls: ['./product-details-five.component.css'],
})
export class ProductDetailsFiveComponent implements OnInit, OnDestroy {
  purchaseStarted: boolean;
  productItem$: Observable<Product | undefined>;
  Products$: Observable<Product[]>;

  sub: Subscription;
  cartCount = 0;
  wishListCount = 0;
  product: Product;
  isLoggedIn$: Observable<boolean>;

  inventoryImages$: Observable<ImageItemIndex[]>;
  cart: Observable<Cart[]>;
  auth: Auth = inject(Auth);

  constructor(
    private route: Router,
    private activateRoute: ActivatedRoute,
    // private wishlistService: WishListService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private menuToggleService: MenuToggleService,
    private imageItemIndexService: ImageItemIndexService
  ) {}

  mainImage: string;
  productIds: string[] = [];
  wishListIds: string[] = [];
  loggedIn: boolean = false;
  quantity: number = 1.0;
  total_cost: number = 0.0;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  userData: any;
  userId: string;
  fb = inject(FormBuilder);
  measurementGroup: FormGroup;

  createEmptyForm() {
    this.measurementGroup = this.fb.group({
      bust: [''],
      waist: [''],
      hips: [''],
      height: [''],
      inseam: [''],
      outseam: [''],
      sleeve_length: [''],
    });
  }

  ngOnInit(): void {
    initTE({ Lightbox });

    // change the auth service
    this.productIds = [];
    this.wishListIds = [];

    this.product = this.activateRoute.snapshot.data['product'];
    this.mainImage = this.product.image;

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
        console.debug('User logged in as : ', this.userId);

        this.cartService
          .cartByStatus(this.userId, 'open')
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((cart) => {
            this.cartCount = cart.length;
            cart.forEach((item) => {
              this.productIds.push(item.product_id);
            });
          });

        // this.wishlistService
        //   .wishListByUserId(this.userId)
        //   .pipe(takeUntil(this._unsubscribeAll))
        //   .subscribe((wishlist) => {
        //     this.wishListCount = wishlist.length;
        //     wishlist.forEach((item) => {
        //       this.wishListIds.push(item.product_id);
        //     });
        //   });
      }
    });

    this.inventoryImages$ = this.imageItemIndexService.getAllImages(this.product.id);
    this.menuToggleService.setCartListCount(this.productIds.length);
    this.menuToggleService.setWishListCount(this.wishListIds.length);
    this.createEmptyForm();
  }

  existsInWishList(): boolean {
    let found = this.wishListIds.find((item) => {
      return item === this.product.id;
    });
    if (found) {
      this.snackBar.open(
        'The item already exists in your wishlist ... ',
        'OK',
        {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 3000,
        }
      );
      return true;
    }
    return false;
  }

  existsInCart(): boolean {
    let found = this.productIds.find((item) => {
      return item === this.product.id;
    });
    if (found) {
      this.snackBar.open('The item already exists in your cart ... ', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'bg-danger',
        duration: 3000,
      });
      return true;
    }
    return false;
  }

  existsInCartByItem(): boolean {
    let found = this.productIds.find((item) => {
      return item === this.product.id;
    });
    if (found) {
      this.snackBar.open('The item already exists in your cart ... ', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'bg-danger',
        duration: 3000,
      });
      return true;
    }
    return false;
  }

  onAddToWishList() {
    let inWishList: Boolean;
    let inCart: Boolean;
    if (this.userId) {
      inWishList = this.existsInWishList();
      if (inWishList === false) {
        inCart = this.existsInCart();
      }
      if (inCart === false) {
        //this.wishlistService.createWishList(this.userId, this.product.id);
        // this.wishListIds.push(this.product.id);
      }
    } else {
      this.route.navigate(['/profile']);
    }
  }

  onAddToShoppingCart() {

    console.debug('onAddToShoppingCart');

    if (this.userId) {
      const inCart = this.existsInCart();
      if (inCart === false) {
        this.cartService.addToCartWithQtyByProduct(
          this.userId,
          this.product.id,
          this.quantity,
          this.product
        );
        this.productIds.push(this.product.id);
        this.cartService.cartCount(this.userId).then((count) => {
          this.menuToggleService.setCartListCount(count);
        });
      }
    } else {
      this.route.navigate(['/profile']);
    }
  }

  onContinueShopping() {
    this.route.navigate(['/shop']);
  }

  onGoShoppingCart() {
    if (this.cartCount > 0) {
      this.route.navigate(['shop/cart', this.userId]);
    } else {
      this.snackBar.open('There are no items in your cart', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'bg-danger',
        duration: 3000,
      });
      return;
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
