import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'app/models/category';
import { Product } from 'app/models/products';
import { CategoryService } from 'app/services/category.service';
import { ProductsService } from 'app/services/products.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DndComponent } from 'app/components/loaddnd/dnd.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageToolbarService } from 'app/services/image-toolbar.service';

export enum ToggleEnum {
  is_clothing,
  is_tailoring,
  is_trousers,
  is_coats_tops,
}

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit, OnDestroy {
  sTitle: any;
  rich_description: string;
  prdGroup: FormGroup;
  currentDate: Date;
  product: Product;
  productId: string;
  updated_category: string;
  toggleEnum = ToggleEnum;
  selectedState = ToggleEnum.is_clothing;
  categories: Category[];
  imageQuery: 'not_used' | 'all' = 'all';
  isFormDirty = false;
  allProducts$: Observable<Product>;
  category$: Observable<Category[]>;
  prd: any;
  sub: any;
  productItem$: Observable<Product>;
  _unsubscribeAll: Subject<any> = new Subject<any>();

  imageToolbarService = inject(ImageToolbarService);
  matDialog = inject(MatDialog);
  activateRoute = inject(ActivatedRoute);
  route = inject(Router);

  categoryService = inject(CategoryService);
  productService = inject(ProductsService);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);

  ngOnDestroy(): void {
    if (this.isFormDirty) {
      this.onUpdate(this.prdGroup.getRawValue());
    }
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit() {
    this.createEmptyForm();
    this.sTitle = 'Product Inventory and Images';
    this.activateRoute.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((params) => {
        const prd = this.productService.findProductByUrl(params['id']);
        if (prd) {
          this.productItem$ = prd;
          this.productId = params['id'];
          this.productItem$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((prd) => {
              if (prd !== undefined) {
                this.rich_description = prd.rich_description;
                this.updated_category = prd.category;
                this.createForm(prd);
              }
            });
        }
      });
    this.category$ = this.categoryService.getAll();
    this.category$.pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
      this.categories = result;
    });
  }

  onTabClick(event: any) {
    const product = { ...this.prdGroup.value } as Product;
    this.onUpdate(product);
  }

  onDelete(data: Product) {
    if (confirm('Are you sure you want to delete ?') === true) {
      data = this.prdGroup.getRawValue();
      this.productService.delete(data.id.toString());
      this.route.navigate(['admin/inventory']);
    }
  }

  onUpdate(product: Product) {
    product.rich_description = this.rich_description;
    if (product.quantity === undefined || product.quantity === null) {
      product.quantity = 1;
    }

    if (
      product.quantity_increment === undefined ||
      product.quantity_increment === null
    ) {
      product.quantity_increment = 1;
    }

    if (product.price === undefined || product.price === null) {
      product.price = 1;
    }

    if (product.brand === undefined || product.brand === null) {
      product.brand = 'Generic';
    }

    if (product.category === undefined || product.category === null) {
      product.category = 'All Categories';
    }

    product.category = this.updated_category;

    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    product.date_created = updateDate;
    this.productService.update(product);
    this.prdGroup.setValue(product);
    this.snackBar.open('Product updated successfully', 'OK', {
      duration: 1000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });

    this.isFormDirty = false;
  }

  onChange($event) {
    this.selectedState = $event.value;
    switch ($event.value) {
      case ToggleEnum.is_clothing:
        this.prdGroup.controls.is_clothing.setValue(true);
        this.prdGroup.controls.is_tailoring.setValue(false);
        this.prdGroup.controls.is_trousers.setValue(false);
        this.prdGroup.controls.is_coats_tops.setValue(false);
        break;
      case ToggleEnum.is_tailoring:
        this.prdGroup.controls.is_clothing.setValue(false);
        this.prdGroup.controls.is_tailoring.setValue(true);
        this.prdGroup.controls.is_trousers.setValue(false);
        this.prdGroup.controls.is_coats_tops.setValue(false);
        break;
      case ToggleEnum.is_trousers:
        this.prdGroup.controls.is_clothing.setValue(false);
        this.prdGroup.controls.is_tailoring.setValue(false);
        this.prdGroup.controls.is_trousers.setValue(true);
        this.prdGroup.controls.is_coats_tops.setValue(false);
        break;
      case ToggleEnum.is_coats_tops:
        this.prdGroup.controls.is_clothing.setValue(false);
        this.prdGroup.controls.is_tailoring.setValue(false);
        this.prdGroup.controls.is_trousers.setValue(false);
        this.prdGroup.controls.is_coats_tops.setValue(true);
        break;
    }
  }

  createProduct(results: any) {
    const newProduct = { ...this.prdGroup.value } as Product;
    newProduct.image = results.data.url;
    this.productService.update(newProduct);
    this.prdGroup.setValue(newProduct);
    // this.afs
    //   .collection('inventory')
    //   .doc(newProduct.id)
    //   .collection('images')
    //   .add(results.data);
  }

  changeCategory(category: any) {
    this.updated_category = category;
  }

  onClassification(prd: Product) {
    console.debug('onClassification', JSON.stringify(prd));
  }

  createEmptyForm() {
    this.prdGroup = this.fb.group({
      id: [''],
      description: ['', Validators.required],
      short_description: ['', Validators.required],
      rich_description: ['', Validators.required],
      image: [''],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      comments: [''],
      user_updated: [''],
      date_created: [new Date(), Validators.required],
      date_updated: [new Date(), Validators.required],
      quantity: [1, Validators.required],
      quantity_required: [true, Validators.required],
      quantity_increment: [1, Validators.required],
      is_active: [true, Validators.required],
      is_featured: [true, Validators.required],
      purchases_allowed: ['', Validators.requiredTrue],
      is_clothing: [true, Validators.required],
      is_tailoring: [false, Validators.required],
      is_coats_tops: [false, Validators.required],
      is_trousers: [false, Validators.required],
    });
  }

  createForm(prd: Product) {
    this.sTitle = 'Inventory - ' + prd.description;

    if (prd.is_clothing) {
      this.selectedState = ToggleEnum.is_clothing;
    }
    if (prd.is_tailoring) {
      this.selectedState = ToggleEnum.is_tailoring;
    }
    if (prd.is_trousers) {
      this.selectedState = ToggleEnum.is_trousers;
    }
    if (prd.is_coats_tops) {
      this.selectedState = ToggleEnum.is_coats_tops;
    }

    this.prdGroup = this.fb.group({
      id: [prd.id],
      description: [prd.description, Validators.required],
      short_description: [prd.short_description, Validators.required],
      rich_description: [prd.rich_description, Validators.required],
      image: [prd.image, Validators.required],
      brand: [prd.brand, Validators.required],
      price: [prd.price, Validators.required],
      quantity_increment: [prd.quantity_increment, Validators.required],
      category: [prd.category, Validators.required],
      comments: [prd.comments, Validators.required],
      quantity: [prd.quantity, Validators.required],
      quantity_required: [prd.quantity_required, Validators.required],
      user_updated: [prd.user_updated, Validators.required],
      date_created: [prd.date_created, Validators.required],
      date_updated: [prd.date_updated, Validators.required],
      purchases_allowed: [prd.purchases_allowed, Validators.required],
      is_featured: [prd.is_featured],
      is_active: [prd.is_active],
      is_clothing: [prd.is_clothing],
      is_tailoring: [prd.is_tailoring],
      is_coats_tops: [prd.is_coats_tops],
      is_trousers: [prd.is_trousers],
    });

    this.prdGroup.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((x) => {
        this.isFormDirty = true;
      });
  }

  onValueChange() {
    this.isFormDirty = true;
    console.debug('Value changed in text editor');
  }

  onBackToInventory() {
    if (this.isFormDirty) {
      const product = { ...this.prdGroup.value } as Product;
      this.onUpdate(product);
    }
    this.route.navigate(['admin/inventory']);
  }

  onImages() {
    const data = this.prdGroup.getRawValue();
    const dialogRef = this.matDialog.open(DndComponent, {
      width: '600px',
      data: {
        parent: data.id,
        location: '/',
        caption: data.description,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === undefined) {
        result = { event: 'Cancel' };
      }
      switch (result.event) {
        case 'Create':
          //this.create(result.data);
          break;
        case 'Cancel':
          break;
      }
    });
  }

  onSweep() {
    this.productService.deleteEmptyInventory();
  }
}
