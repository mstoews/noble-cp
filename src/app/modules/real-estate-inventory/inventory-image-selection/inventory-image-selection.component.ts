import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, map, shareReplay, takeUntil } from 'rxjs';
import { ImageItemIndex } from 'app/models/imageItem';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ProductsService } from 'app/services/products.service';
import { DeleteDuplicateService } from 'app/services/delete-duplicate.service';
import { ImageItemIndexService } from 'app/services/image-item-index.service';
import {
  FilterEnum,
  ImageToolbarService,
} from 'app/services/image-toolbar.service';

@Component({
  selector: 'inventory-image-selection',
  templateUrl: './inventory-image-selection.component.html',
  styleUrls: ['./inventory-image-selection.component.css'],
})
export class InventoryImageSelectionComponent implements OnInit, OnDestroy {
  @Input() productId: string;
  @Input() imageQuery: string;

  _unsubscribeAll: Subject<any> = new Subject<any>();

  currentImage: ImageItemIndex;
  IN_NOT_USED = 'IN_NOT_USED';

  not_usedImages: ImageItemIndex[] = [];
  collectionsImages: ImageItemIndex[] = [];

  imageToolbarService = inject(ImageToolbarService);
  filterSig = this.imageToolbarService.filterSig;

  constructor(
    private deleteDupes: DeleteDuplicateService,
    public imageItemIndexService: ImageItemIndexService,
    private productService: ProductsService,
    private fb: FormBuilder
  ) {
    this.imageQuery = 'all';
    console.debug(
      'inventory-image-selection.component.ts: filterSig',
      this.filterSig
    );
    this.imageItemIndexService.updateProductItems();
  }

  addImageToItemList(image: any) {
    image.parentId = this.productId;
    // search for the image in the list 400 size and add it to the list
    this.imageItemIndexService.updateImageList(image);
  }

  createImageOnce() {}

  refreshList() {}

  UpdateInventoryItem(e: ImageItemIndex) {
    e.type = this.productId;
    this.imageItemIndexService.updateImageList(e);
  }

  async sortNotUsed(query: string) {
    query = this.imageToolbarService.filterSig();
    if (query === FilterEnum.all) {
      query = null;
    } else {
      query = FilterEnum.not_used;
    }

    return (
      await this.imageItemIndexService.getAllImages(this.IN_NOT_USED)
    ).pipe(
      map((data) => {
        data.sort((a, b) => {
          return a.caption < b.caption ? -1 : 1;
        }),
          shareReplay();
        return data;
      })
    );
  }

  public async Refresh(query: string) {
    this.imageQuery = query;
    if (query === undefined || query === null) {
      query = 'all';
    }
    (await this.sortNotUsed(this.IN_NOT_USED))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((images) => {
        this.not_usedImages = images;
      });

    (
      await this.imageItemIndexService.getOriginalImageListByType(
        this.productId
      )
    )
      .pipe(takeUntil(this._unsubscribeAll), shareReplay())
      .subscribe((item) => {
        this.collectionsImages = item;
      });
  }

  ngOnInit() {
    this.Refresh(this.imageToolbarService.filterSig());
    console.debug(
      'inventory-image-selection.component.ts: sortNotUsed()',
      this.filterSig
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  drop(event: CdkDragDrop<ImageItemIndex[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateRanking(
        event.container.data,
        event.currentIndex,
        event.container.id
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateImageType(
        event.previousContainer.data,
        event.container.data,
        event.container.id,
        event.currentIndex
      );
    }
  }

  private updateRanking(
    ImageItemIndex: any,
    currentIndex: number,
    newContainerId: string
  ) {
    if (newContainerId !== this.IN_NOT_USED) {
      ImageItemIndex.forEach((element: any) => {
        element.ranking = ImageItemIndex.indexOf(element);
        this.imageItemIndexService.updateImageList(element);
      });
    }
  }

  private updateImageType(
    previousData: any,
    newData: any,
    newContainerId: string,
    currentIndex: number
  ) {
    const image = newData[currentIndex];
    image.ranking = 0;
    image.type = newContainerId;
    console.debug('Update Image Type', image);
    this.imageItemIndexService.updateImageList(image);
  }
}
