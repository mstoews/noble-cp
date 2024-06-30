import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Route, Router, TitleStrategy } from '@angular/router';
import { Product } from 'app/models/products';
import { CategoryService } from 'app/services/category.service';
import { ProductsService } from 'app/services/products.service';
import { Observable, Subscription, combineLatest, map, of, tap } from 'rxjs';
import { Category } from 'app/models/category';

interface shopData {
  category: Category;
  products: Product[];
  categories: Category[];
}

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainShopComponent implements OnInit, OnDestroy {
  products$: Observable<Product[]>;
  category$: Observable<Category[]>;
  category: string;
  data$: Observable<shopData>;
  refresh = true;

  sub: Subscription;
  loading = false;
  MOBILE_SIZE = 768;

  route = inject(Router);
  actRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);
  categoryService = inject(CategoryService);

  //   Category$ = this.categoryService.getAll();

  mobile = true;

  ngOnInit(): void {
    this.category = this.actRoute.snapshot.paramMap.get('id');

    if (window.screen.width <= this.MOBILE_SIZE) {
      // 768px portrait
      this.mobile = true;
    } else {
      this.mobile = false;
    }

    this.products$ = this.productService.getInventoryByCategory(this.category);
    this.category$ = this.categoryService.getCategoryList();
    this.data$ = combineLatest([
      of(this.category),
      this.products$,
      this.category$,
    ]).pipe(
      map(([category, products, categories]) => {
        return { category, products, categories };
      }),
      tap(console.debug)
    );
    this.refresh = true;
  }

  openProductDetail(productId: string) {
    this.route.navigate(['shop/product', productId]);
  }

  backToHome() {
    this.route.navigate(['home']);
  }

  updateCategory(e: any) {
    this.onRefreshName(e);
  }

  onRefreshName(category: string) {
    this.category = category;
    this.products$ = this.productService.getInventoryByCategory(category);
    this.data$ = combineLatest([
      of(category),
      this.products$,
      this.category$,
    ]).pipe(
      map(([category, products, categories]) => {
        return { category, products, categories };
      }),
      tap(console.debug)
    );
  }

  selectCategory(index: any) {
    if (index.index >= 0) {
      const category = this.categoryService.getAll();
      this.sub = category.subscribe((data) => {
        this.onRefreshName(data[index.index].name);
      });
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
