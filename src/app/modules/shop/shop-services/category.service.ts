import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  collectionData,
  Timestamp,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Observable, Subscription, map } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { ProductsService } from './products.service';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService implements OnDestroy {
  private sub: Subscription;
  private hashSub: Subscription;
  private catSub: Subscription;

  productsService: ProductsService = inject(ProductsService);
  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);

  ngOnDestroy(): void {
    if (this.sub !== undefined) this.sub.unsubscribe();
    if (this.hashSub !== undefined) this.hashSub.unsubscribe();
    if (this.catSub !== undefined) this.catSub.unsubscribe();
  }

  hashUsedCategoryMap = new Map<string, string>();

  // use this function ot limit the category list to only those that have products.
  updateIsUsedCategoryList() {
    // load all the current categories into a map
    this.hashSub = this.getCategoryList().subscribe((category) => {
      category.forEach((doc) => {
        this.hashUsedCategoryMap.set(doc.name, doc.name);
      });
    });

    // load all the current products into a map
    this.sub = this.productsService
      .getAvailableInventory()
      .subscribe((inventory) => {
        inventory.forEach((item) => {
          if (item.category !== undefined) {
            if (this.hashUsedCategoryMap.has(item.category) === false)
              this.hashUsedCategoryMap.set(item.category, item.category);
          }
        });

        // Add all categories item if it does not exist
        if (this.hashUsedCategoryMap.has('All Categories') === false) {
          this.hashUsedCategoryMap.set('All Categories', 'All Categories');
        }

        const cats = this.getAll();
        cats.forEach((doc) => {
          doc.forEach((categoryItem) => {
            if (this.hashUsedCategoryMap.has(categoryItem.name)) {
              categoryItem.isUsed = true;
              this.update(categoryItem);
            } else {
              categoryItem.isUsed = false;
              this.update(categoryItem);
            }
          });
        });
      });
  }

  //Query

  getAll() {
    const collectionRef = query(
      collection(this.firestore, 'category'),
      orderBy('name')
    );
    return collectionData(collectionRef, { idField: 'id' }) as Observable< Category[] >;
  }

  getById(id: string) {
    const collectionRef = collection(this.firestore, 'category');
    const blog = doc(collectionRef, id);
    return docData(blog) as Observable<Category>;
  }

  getCategoryList() {
    return this.getAll().pipe(
      map((category) =>
        category.filter((available) => available.isUsed === true)
      )
    );
  }

  // Add
  add(category: Category) {
    return addDoc(collection(this.firestore, 'category'), category);
  }

  // Update

  update(category: any) {
    const ref = doc(
      this.firestore,
      'category',
      category.id
    ) as DocumentReference<Category>;
    return updateDoc(ref, category);
  }

  // Delete
  delete(id: string) {
    const ref = doc(this.firestore, 'category', id);
    return deleteDoc(ref);
  }
}
