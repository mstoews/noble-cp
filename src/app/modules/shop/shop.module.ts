import { Injectable, NgModule, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ShopComponent } from './main.component';
import {
  Routes,
  RouterModule,
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
  Resolve,
} from '@angular/router';
import { MainShopComponent } from './shop/main-shop/shop.component';
import { ShopCardComponent } from './shop/main-shop/shop-card/shop-card.component';

import { CartComponent } from './shop/cart/cart.component';
import { ProductDetailsFiveComponent } from './shop/shop-product/product-details-five.component';
import { SafePipe } from './safe.pipe';
import { StripeCheckoutComponent } from './shop/stripe-checkout/stripe-checkout.component';
import { ComingSoonComponent } from './shop/coming-soon/coming-soon.component';
import { WishListComponent } from './shop/wishlist/wishlist.component';
import { PurchaseThanksComponent } from './shop/thanks/purchase-thanks';
import { CheckoutComponent } from './shop/checkout.component';
import { PaymentConfirmationComponent } from './shop/payment-confirmation/payment-confirmation.component';
import { WishlistCardComponent } from './shop/wishlist/wishlist-card/wishlist-card.component';
import { ShopLandingComponent } from './shop/shop-landing/shop-landing.component';
import { ShopLandingCardComponent } from './shop/shop-landing/shop-landing-card/shop-landing-card.component';

import { ShopCategoryCardComponent } from './shop/main-shop/shop-category-card/shop-category-card.component';
import { LightboxModule } from '../lightbox';
import { StripHtmlPipe } from './striphtml.pipe';
import { ElementsComponent } from './shop/cart/elements/elements.component';
import { AddComponentDialog } from './shop-inventory-maintenance/add/add.component';
import { Product } from './models/products';
import { ProductResolver } from './shop-services/product.resolver';
import { CartResolver } from './shop-services/cart.resolver';
import { MaterialModule } from 'app/services/material.module';
import { InventoryComponent } from './shop-inventory-maintenance/inventory-grid.component';
import { ProductsService } from './shop-services/products.service';

export const ProductFuncResolver: ResolveFn<Product[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(ProductsService).getInventoryByCategory(
    route.paramMap.get('id')
  );
};

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Shop Landing',
    component: ShopLandingComponent,
    data: { state: 'shop-landing' },
  },
  {
    path: 'shop',
    pathMatch: 'full',
    title: 'Shopping',
    component: MainShopComponent,
  },
  {
    path: 'category/:id',
    pathMatch: 'full',
    title: 'Shopping',
    component: MainShopComponent,
    // resolve: {
    //   shop: ProductFuncResolver,
    // },
    data: { state: 'category/:id' },
  },
  {
    path: 'product/:id',
    title: 'Shopping Items',
    component: ProductDetailsFiveComponent,
    resolve: {
      product: ProductResolver,
    },
    data: { state: 'product/:id' },
  },
  {
    path: 'cart/:id',
    title: 'Shopping Cart',
    component: CartComponent,
    resolve: { cart: CartResolver },
    data: { state: 'cart/:id' },
  },
  {
    path: 'wishlist/:id',
    pathMatch: 'full',
    title: 'Wish List',
    component: WishListComponent,
    resolve: {
      // wishlist: WishListResolver,
    },
    data: { state: 'wishlist/:id' },
  },

  {
    path: 'stripe-checkout',
    pathMatch: 'full',
    title: 'Stripe Checkout',
    component: StripeCheckoutComponent,
    data: { state: 'stripe-checkout' },
  },
  {
    path: 'coming-soon',
    pathMatch: 'full',
    title: 'Coming in January',
    component: ComingSoonComponent,
    data: { state: 'coming-soon' },
  },
  {
    path: 'purchase-thanks',
    pathMatch: 'full',
    title: 'Purchases',
    component: PurchaseThanksComponent,
    data: { state: 'purchase-thanks' },
  },

  {
    path: 'checkout',
    pathMatch: 'full',
    title: 'Checkout',
    component: CheckoutComponent,
    data: { state: 'checkout' },
  },
];

@NgModule({
  declarations: [
    ShopComponent,
    MainShopComponent,
    CartComponent,
    ShopCardComponent,
    ProductDetailsFiveComponent,
    StripeCheckoutComponent,
    SafePipe,
    ComingSoonComponent,
    WishListComponent,
    PurchaseThanksComponent,
    CheckoutComponent,
    PaymentConfirmationComponent,
    WishlistCardComponent,
    ShopLandingComponent,
    ShopLandingCardComponent,
    ShopCategoryCardComponent,
    ElementsComponent,
    StripHtmlPipe,
    
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    MaterialModule,
    RouterModule.forChild(routes),
    LightboxModule,
    InventoryComponent
  ],
})
export class ShopModule {}
