import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { filter, Observable, Subject, takeUntil } from 'rxjs';

import { Product } from '../models/products';
import { MatDrawer } from '@angular/material/sidenav';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { openAddComponentDialog } from './add/add.component';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
// import { CategoryService } from '../shop-services/category.service';
import { Category } from '../models/category';
import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/services/material.module';
import { ProductsService } from '../shop-services/products.service';
import { IImageStorage } from '../models/maintenance';
import { GridModule } from '@syncfusion/ej2-angular-grids';

const imports = [
    CommonModule,
    MaterialModule,
    GridModule
]

@Component({
  standalone: true,
  imports: [imports],
  selector: 'inventory-list',
  templateUrl: './inventory-grid.component.html',
  styleUrls: ['./inventory-grid.component.css'],
})
export class InventoryComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatDrawer;
  @Input() rich_description: string;
  drawOpen: 'open' | 'close' = 'open';
  prdGroup: FormGroup;
  action: string;
  party: string;
  sTitle: string;
  cPriority: string;
  cRAG: string;
  cType: string;
  currentDate: Date;
  product: Product;
  productId: string;
  current_Url: string;
  updated_category: string;
  selectedItemKeys: string;
  categories: Category[];
  inventoryImages$: Observable<IImageStorage[]>;
  allProducts$: Observable<Product[]>;
  category$: Observable<Category[]>;
  prd: any;

  private matDialog = inject(MatDialog);
  private route  = inject(Router);
  // private readonly categoryService = inject(CategoryService);
  private readonly productService  = inject( ProductsService);
  private dialog  = inject(MatDialog);
  private fb  = inject(FormBuilder);


  onRefresh() {
    this.allProducts$ = this.productService.getAll();
  }

  valueChangedEvent($event: Event) {
    console.debug('valueChangedEvent');
  }

  onRowPrepared(e: any) {
    if (e.rowIndex % 2 === 0)
        e.rowElement.style.height = "10px";
  }

  onCellDoubleClicked(e) {
    this.route.navigate(['admin/inventory', e.data.id]);
  }

  /**
   * The dialogue entry is passed the current entry and parentId which is subsequently
   * passed back so the images collection can be created from the parent inventory item.
   * The parentID must exist before the image collection could be created.
   */

  onExporting(e: { component: any; cancel: boolean }) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Inventory');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: 'application/octet-stream' }),
          'DataGrid.xlsx'
        );
      });
    });
    e.cancel = true;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  _unsubscribeAll: Subject<any> = new Subject<any>();
  // pipe(takeUntil(this._unsubscribeAll))

  onImages(): void {
    // console.debug('onImages');
    const parentId = this.prdGroup.getRawValue();
    const dialogRef = this.matDialog.open(DndComponent, {
      width: '500px',
      data: parentId.id,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result: any) => {
        if (result === undefined) {
          result = { event: 'Cancel' };
        }
        switch (result.event) {
          case 'Create':
            // console.debug(`create Images to save: ${JSON.stringify(result.data)}`);
            this.createProduct(result);
            break;
          case 'Cancel':
            // console.debug(`Image transfer cancelled`);
            break;
        }
      });
  }

  createProduct(results: any) {
    const newProduct = { ...this.prdGroup.value } as Product;
    newProduct.image = results.data.url;
    this.productService.update(newProduct);
    this.prdGroup.setValue(newProduct);
  }

  changeCategory(category: any) {
    this.updated_category = category;
  }

  ngOnInit() {

    this.sTitle = 'Product Inventory and Images';
    this.allProducts$ = this.productService.getAll();
    this.prd = this.productType;
    this.createEmptyForm();
  }

  onOpenRow(row: any) {
    this.route.navigate(['admin/inventory', row.id]);
  }

  rowHeight = '500px';

  handsetPortrait = false;

  onFocusedRowChanged(e: any) {
    const rowData = e.row && e.row.data;
    // console.debug(`onFocusRowChanged ${JSON.stringify(rowData)}`)
    this.current_Url = rowData.images;
    this.prdGroup.setValue(rowData);
  }

  dateFormatter(params: any) {
    const dateAsString = params.value;
    const dateParts = dateAsString.split('-');
    return `${dateParts[0]} - ${dateParts[1]} - ${dateParts[2].slice(0, 2)}`;
  }

  onAdd() {
    openAddComponentDialog(this.dialog, this.product)
      .pipe(filter((val) => !!val))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((val) => console.debug('new inventory item', val));
  }

  onCreate() {
    const newProduct = { ...this.prdGroup.value } as Product;
    // console.debug(`onCreate ${newProduct}`);
    this.productService.create(newProduct);
  }

  onUpdate(data: Product) {
    data = this.prdGroup.getRawValue();
    data.category = this.updated_category;
    data.rich_description = this.rich_description;
    console.debug(`onUpdate:  ${JSON.stringify(data)}`);
    this.productService.update(data);
  }

  public productType = {
    id: '',
    description: '',
    short_description: '',
    rich_description: '',
    image: '',
    images: '',
    brand: '',
    price: '',
    category: '',
    comments: '',
    is_featured: '',
    user_updated: '',
    date_created: '',
    date_updated: '',
  };

  createEmptyForm() {
    this.prdGroup = this.fb.group({
      id: [''],
      description: [''],
      short_description: [''],
      rich_description: [''],
      image: [''],
      images: [''],
      brand: [''],
      price: [''],
      category: [''],
      comments: [''],
      is_featured: [''],
      user_updated: [''],
      date_created: [''],
      date_updated: [''],
      is_tailoring: [''],
    });
  }

  createForm(prd: Product) {
    this.sTitle = 'Inventory - ' + prd.description;

    this.prdGroup = this.fb.group({
      id: [prd.id],
      description: [prd.description],
      short_description: [prd.short_description],
      rich_description: [prd.rich_description],
      image: [prd.image],
      brand: [prd.brand],
      price: [prd.price],
      category: [prd.category],
      comments: [prd.comments],
      is_featured: [prd.is_featured],
      is_tailoring: [prd.is_tailoring],
      user_updated: [prd.user_updated],
      date_created: [prd.date_created],
      date_updated: [prd.date_updated],
    });
  }

  columnsToDisplay: string[] = [
    // 'actions',
    'image',
    'description',
    'short_description',
    'rich_description',
    'price',
  ];
}