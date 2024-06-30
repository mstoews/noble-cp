import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ImageItemIndex } from 'app/models/imageItem';
import { openViewComponentDialog } from './view-image-item/view-image-item.component';
import { filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-inventory-image-card',
  templateUrl: './inventory-image-card.component.html',
})
export class InventoryImageCardComponent {
  dialog = inject(MatDialog);

  onDblClick(e: any) {
    this.imageSelected.emit(this.image);
    // openViewComponentDialog(this.dialog, this.image, this.productId);
  }

  onView() {
    let image = {
      description: this.image.description,
      caption: this.image.caption,
      imageSrc: this.image.imageSrc,
      imageAlt: this.image.imageAlt,
      type: this.image.type,
      id: this.image.id,
    };
    console.debug(JSON.stringify(image));
    openViewComponentDialog(this.dialog, image, this.productId);
  }

  @Input() image: ImageItemIndex;
  @Input() productId: string;
  @Output() imageSelected: EventEmitter<ImageItemIndex> = new EventEmitter();
}
