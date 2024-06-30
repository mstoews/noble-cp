import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  first,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
  throwError,
} from 'rxjs';
import { Cart } from 'app/models/cart';
import { Product } from 'app/models/products';
import { convertSnaps } from './db-utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth/auth.service';

import {
  doc,
  docData,
  DocumentReference,
  getCountFromServer,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  collectionData,
  Timestamp,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnDestroy {
  // private cartCollection: AngularFirestoreCollection<Cart>;
  isLoggedIn: boolean;
  userId: string;
  cart$: Observable<Cart[]>;
  cartItems$: Observable<Cart[]>;
  userCountry: string;
  // Manage state with signals
  cartItem = signal<Cart[]>([]);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  cartCounter = signal<number>(0);
  afs = inject(Firestore);
  auth = inject(Auth);
  authService = inject(AuthService);
  snack = inject(MatSnackBar);
  firestore: Firestore = inject(Firestore);

  updateCartCounter(userId: string) {
    this.cartByStatus(userId, 'open')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cart) => {
        console.debug('cart length:', cart.length);
      });
  }

  async cartCount(userId: string): Promise<number> {
    const count = await getCountFromServer(
      collection(this.firestore, `users/${this.userId}/cart/`)
    );
    console.log('cartCount: ', count.data().count);
    return count.data().count;
  }

  getAll(userId: string) {
    return collectionData(collection(this.firestore, `users/${userId}/cart`), {
      idField: 'id',
    }) as Observable<Cart[]>;
  }

  get(id: string, userId: string) {
    return getDoc(doc(this.firestore, `users/${userId}/cart/${id}`));
  }

  cartByUserId(userId: string): Observable<Cart[] | undefined> {
    return collectionData(collection(this.firestore, `users/${userId}/cart`), {idField: 'id',}) as Observable<Cart[]>;
  }

  cartByStatus(userId: string, cartStatus: string) {
    return collectionData(collection(this.firestore, `users/${userId}/cart`), {
      idField: 'id',
    }).pipe( map((cart) => cart.filter((status) => status.status === cartStatus))
    ) as Observable<Cart[]>;
  }

  async getCartCountByUser(userId: string): Promise<number> {
    const count = await await getCountFromServer(
      collection(this.firestore, `users/${userId}/cart/`)
    );
    console.log('count getCartCountByUser: ', count.data().count);
    return count.data().count;
  }

  async create(userId: string, product: Product) {
    const Ref = collection(this.firestore, `users/${userId}/cart/`);
    addDoc(Ref, product)
      .then((newCart) => {
        updateDoc(doc(Ref, newCart.id), { id: newCart.id });
        this.snack.open('Selection has been added to your cart ...', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 3000,
        });
      })
      .catch((error) => {
        this.snack.open(
          `Selection has NOT been added to your cart ...\n${error} `,
          'OK',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'bg-danger',
            duration: 3000,
          }
        );
      });
  }

  findProductById(id: string): Observable<Product | undefined> {
    const ref = collection(this.firestore, `inventory`);
    return docData(doc(ref, id)) as Observable<Product>;
  }

  addToCart(userId: string, productId: string) {
    let prod = this.findProductById(productId);
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];

    if (prod) {
      prod.subscribe((result) => {
        const cart: Product = {
          ...result,
          id: productId,
          is_completed: false,
          user_purchased: userId,
          date_sold: updateDate,
          date_updated: updateDate,
          status: 'open',
          quantity: 1,
        };
        this.create(userId, cart);
      });
    }
  }

  addToCartWithQuantity(userId: string, productId: string, quantity: number) {
    let prod = this.findProductById(productId);
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    if (prod) {
      prod.subscribe((result) => {
        // get the wish item
        const cart: Product = {
          ...result,
          product_id: productId,
          is_completed: false,
          user_purchased: userId,
          date_sold: updateDate,
          date_updated: updateDate,
          quantity: quantity,
          status: 'open',
        };
        // create the cart item from the list item
        this.create(userId, cart)
          .then(() => {
            this.cartCounter.set(this.cartCounter() + 1);
          })
          .catch((error) => {
            console.log('Error adding cart item');
            alert(`Error adding cart item:  error ${error}`);
          });

        // delete the wish item from the wish list
        this.deleteWishListItemById(productId);
      });
    }
  }

  addToCartWithQtyByProduct(userId: string, productId: string, quantity: number, product: Product) {
    // let prod = this.findProductById(productId);
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    if (product) {
        const cart: Product = {
          ...product,
          product_id: productId,
          is_completed: false,
          user_purchased: userId,
          date_sold: updateDate,
          date_updated: updateDate,
          quantity: quantity,
          status: 'open',
        };
        // create the cart item from the list item
        this.create(userId, cart)
          .then(() => {
            this.cartCounter.set(this.cartCounter() + 1);
          })
          .catch((error) => {
            console.log('Error adding cart item');
            alert(`Error adding cart item:  error ${error}`);
          });
        this.deleteWishListItemById(productId);
    }
  }


  deleteWishListItemById(id: string) {
    const collectionRef = collection(
      this.firestore,
      `users/${this.userId}/wishlist/`
    );
    deleteDoc(doc(collectionRef, id));
    return true;
  }

  // const collectionRef = collection(this.firestore, `blog/${blog_id}/comment/`);
  // const ref = doc(collectionRef, commentId);
  // updateDoc(ref, comment);

  update(cart: any) {
    const ref = doc(
      collection(this.firestore, `users/${this.userId}/cart`),
      cart.id
    ) as DocumentReference<Cart>;
    updateDoc(ref, cart)
      .then(() => {
        this.snack.open('Cart has been updated ... ', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 2000,
        });
      })
      .catch((error) => {
        console.log('Error updating cart');
        alert(`Error updating cart:  error ${error}`);
      });
  }

  updateByCartId(userId:string, cart: any, id: string) {
    const ref = doc(
      collection(this.firestore, `users/${userId}/cart`),
      id
    ) as DocumentReference<Cart>;
    updateDoc(ref, cart)
      .then(() => {
        this.snack.open('Cart has been updated ... ', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 2000,
        });
      })
      .catch((error) => {
        console.log('Error updating cart');
        alert(`Error updating cart:  error ${error}`);
      });
  }

  updatePurchasesList(cart: any) {
    const Ref = collection(this.firestore, `purchases`);
    addDoc(Ref, cart)
      .then((newCart) => {
        updateDoc(doc(Ref, newCart.id), { id: newCart.id });
        this.snack.open('Selection has been added to your cart ...', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 3000,
        });
      })
      .catch((error) => {
        this.snack.open(
          `Selection has NOT been added to your cart ...\n${error} `,
          'OK',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'bg-danger',
            duration: 3000,
          }
        );
      });
  }

  delete(userId: string, id: string) {
    const ref = doc(this.firestore, `users/${userId}/cart`, id);
    deleteDoc(ref)
      .then(() => {
        this.snack.open('Item has been removed ... ', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 2000,
        });
      })
      .catch((error) => {
        this.snack.open('Item has NOT been removed ... ', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 2000,
        });
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
