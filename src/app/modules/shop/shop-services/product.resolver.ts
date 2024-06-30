import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Product } from '../models/products';
import { Observable } from 'rxjs';
import { ProductsService } from './products.service';

@Injectable()
export class ProductResolver {
  constructor(private productsService: ProductsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product | undefined> {
    const id = route.paramMap.get('id') as string;
    return this.productsService.getById(id);
  }
}
