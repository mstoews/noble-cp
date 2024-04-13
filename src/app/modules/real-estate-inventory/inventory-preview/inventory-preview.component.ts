import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { IProduct } from 'app/models';
import { ImageItemIndex } from 'app/models';
import { Observable } from 'rxjs';
import { ProductsService } from 'app/services/products.service';

@Component({
  selector: 'inventory-preview',
  templateUrl: './inventory-preview.component.html',
  styleUrls: ['./inventory-preview.component.css'],
})
export class InventoryPreviewComponent implements OnInit {
  @Input() product: IProduct;
  inventoryImages$: Observable<ImageItemIndex[]>;
  mainImage: string;

  constructor(private productService: ProductsService) { }

  setImage(e: ImageItemIndex): void {
    this.mainImage = e.imageSrc400;
    this.product.image200 = e.imageSrc200;
    this.product.image = e.imageSrc400;
  }

  onUpdate() {
    this.productService.updateMainImage(this.product);
  }

  async ngOnInit() {
    this.mainImage = this.product.image;
    console.debug(
      'inventory-preview.component.ts: ngOnInit()',
      JSON.stringify(this.product)
    );

    if (this.product.id) {
      this.inventoryImages$ = await this.productService.getImageListByProduct(
        this.product.id
      );
    }
  }
}
