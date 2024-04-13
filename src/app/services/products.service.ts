import { Injectable, inject } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { IProduct } from 'app/models';
import { ImageItemIndex } from 'app/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  DocumentReference,
  Firestore,
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { collectionData, docData } from 'rxfire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  ALL_CATEGORY = 'All Categories';

  // imageItemIndexService: ImageItemIndexService = inject(ImageItemIndexService);
  firestore = inject(Firestore);
  snackBar = inject(MatSnackBar);

  //Query

  getAll() {
    const collectionRef = query(
      collection(this.firestore, 'inventory'),
      orderBy('category')
    );
    return collectionData(collectionRef, { idField: 'id' }) as Observable<
      IProduct[]
    >;
  }

  getInventoryByCategory(category: string) {
    if (category === this.ALL_CATEGORY || category === null) {
      return this.getAvailableInventory();
    } else {
      const collectionRef = query(
        collection(this.firestore, 'inventory'),
        and(
          where('category', '==', category),
          where('purchases_allowed', '==', true)
        ),
        orderBy('category')
      );
      return collectionData(collectionRef, { idField: 'id' }) as Observable<IProduct[]>;
    }
  }

  getById(id: string) {
    const collectionRef = collection(this.firestore, 'inventory');
    const ref = doc(collectionRef, id);
    return docData(ref) as Observable<IProduct>;
  }

  getProductList() {
    return this.getAll().pipe(
      map((product) =>
        product.filter((available) => available.purchases_allowed === true)
      )
    );
  }

  // Add
  add(product: IProduct) {
    return addDoc(collection(this.firestore, 'inventory'), product);
  }

  // Update

  update(product: any) {
    const ref = doc(
      this.firestore,
      'inventory',
      product.id
    ) as DocumentReference<IProduct>;
    return updateDoc(ref, product);
  }

  // Delete
  delete(id: string) {
    const ref = doc(this.firestore, 'product', id);
    return deleteDoc(ref);
  }

  createPartial(productPartial: IProduct) {
    this.add(productPartial);
  }

  updateMainImage(product: IProduct) {
    this.update(product);
    this.snackBar.open('Main image updated', 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'bg-danger',
      duration: 2000,
    });
  }

  deleteEmptyInventory() {
    alert('delete empty Inventory not used');
    // const allInventory = this.afs.collection<Product>('inventory');
    // const allItems = allInventory.valueChanges();
    // allItems.pipe(
    //   map((inventory) => {
    //     inventory.map((items) => {
    //       if (items.description === undefined) {
    //         console.debug(items.id);
    //       }
    //     });
    //   })
    // );
  }

  get(id: string) {
    return this.getById(id);
  }

  getAvailableInventory() {
    return this.getAll().pipe(
      map((inventory) =>
        inventory.filter((available) => available.purchases_allowed === true)
      )
    );
  }

  getInventoryByProduct(category: string) {
    if (category === this.ALL_CATEGORY || category === null) {
      return this.getAvailableInventory();
    } else {
      return this.getAvailableInventory().pipe(
        map((inventory) =>
          inventory.filter((product) => product.category === category)
        )
      );
    }
  }

  getProductImage(parentId: string): any {
    const collectionRef = collection(this.firestore, 'originalImageList');
    const col = collectionData(collectionRef, { idField: 'id' }) as Observable<
      ImageItemIndex[]
    >;
    return col.pipe(
      map((images) => images.filter((product) => product.parentId === parentId))
    );
  }

  getImageList() {
    const collectionRef = collection(this.firestore, 'originalImageList');
    const q = query(collectionRef, orderBy('ranking'));
    return collectionData(q, { idField: 'id' }) as Observable<ImageItemIndex[]>;
  }

  getImageListByProductId(parentId: string) {
    const q = query(
      collection(this.firestore, 'originalImageList'),
      where(parentId, '==', parentId),
      orderBy('ranking')
    );
    return collectionData(q, { idField: 'id' }) as Observable<ImageItemIndex[]>;
  }

  async getImageListByProduct(type: string) {
    if (type === null || type === undefined || type === '') {
      return this.getImageList();
    } else {
      return this.getImageList().pipe(
        map((images) => images.filter((types) => types.type === type))
      );
    }
  }

  findProductByUrl(id: string): Observable<IProduct> {
    const collectionRef = collection(this.firestore, 'inventory');
    const q = query(collectionRef, where('id', '==', id));
    const list = collectionData(q, { idField: 'id' }) as Observable<IProduct[]>;
    return list.pipe(map((product) => product[0]));
  }

  create(product: IProduct) {
    return addDoc(collection(this.firestore, 'inventory'), product);
  }

  updatePartial(product: IProduct) {
    return addDoc(collection(this.firestore, 'inventory'), product);
  }
}
