import { Component, Inject, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICategory } from 'app/models';
import { IProduct } from 'app/models';
import { CategoryService } from 'app/services/category.service';
import { ProductsService } from 'app/services/products.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponentDialog implements OnDestroy {
  description: string;
  categories: ICategory[];
  updated_category: string;
  category$: Observable<ICategory[]>;
  form: FormGroup;
  productId: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private product: IProduct,
    private readonly productService: ProductsService,
    private readonly categoryService: CategoryService,
    private dialogRef: MatDialogRef<AddComponentDialog>,
    private route: Router
  ) {
    this.description = product.description;
    this.createForm();
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit() {
    this.category$ = this.categoryService.getAll();
    this.category$.pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
      this.categories = result;
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      category: ['', Validators.required],
      description: ['', Validators.required],
      rich_description: ['', Validators.required],
      date_created: ['', Validators.required],
    });
  }

  update(results: any) {
    const newProductPartial = { ...this.form.value } as IProduct;
    this.productService.createPartial(newProductPartial);
    this.route.navigate(['admin/inventory', this.productId]);
    this.close();
  }

  changeCategory(category: any) {
    this.updated_category = category;
  }

  close() {
    this.dialogRef.close();
  }
}

export function openAddComponentDialog(dialog: MatDialog, product: IProduct) {
  const config = new MatDialogConfig();

  config.disableClose = true;
  config.autoFocus = true;
  config.panelClass = 'modal-panel';
  config.backdropClass = 'backdrop-modal-panel';
  config.width = '400px';

  config.data = {
    ...product,
  };

  const dialogRef = dialog.open(AddComponentDialog, config);

  return dialogRef.afterClosed();
}
