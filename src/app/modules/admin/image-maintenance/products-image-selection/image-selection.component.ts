import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Input,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, Subscription, map, pipe, takeUntil } from 'rxjs';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';
import { ImageItemIndex } from 'app/5.models/imageItem';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ProductsService } from 'app/4.services/products.service';
import { DeleteDuplicateService } from 'app/4.services/delete-duplicate.service';

@Component({
  selector: 'inventory-img-selection',
  templateUrl: './image-selection.component.html',
  styleUrls: ['./image-selection.component.css'],
})
export class ImageSelectionComponent implements OnInit, OnDestroy {
  @Input() productId: string;

  currentImage: ImageItemIndex;

  IN_NOT_USED = 'IN_NOT_USED';
  IN_DELETED = 'IN_DELETED';
  IN_COLLECTION = 'IN_COLLECTION';

  subNotUsed: Subscription;
  subDeleted: Subscription;
  subMain: Subscription;
  subCollections: Subscription;

  not_usedImages: ImageItemIndex[] = [];
  deletedImages: ImageItemIndex[] = [];
  collectionsImages: ImageItemIndex[] = [];
  inventoryImages$: Observable<ImageItemIndex[]>;
  firstRun: boolean = true;

  constructor(
    private imageItemIndexService: ImageItemIndexService,
  ) { }

  createImageOnce() {
    throw new Error('Method not implemented.');
  }
  RefreshList() {
    throw new Error('Method not implemented.');
  }

  addImageToItemList(image: any) {
    image.parentId = this.productId;
    // search for the image in the list 400 size and add it to the list
    this.imageItemIndexService.updateImageList(image);
  }

  UpdateInventoryItem(e: ImageItemIndex) {
    e.type = this.productId;
    this.imageItemIndexService.updateImageList(e);
  }

  async sortNotUsed() {
    return (await this.imageItemIndexService.getImageIndexList()).pipe(
      map((data) => {
        data.sort((a, b) => {
          return a.caption < b.caption ? -1 : 1;
        });
        return data;
      })
    );
  }

  _unsubscribeAll: Subject<any> = new Subject<any>();

  async Refresh() {
    this.subNotUsed = (await this.sortNotUsed()).pipe(takeUntil(this._unsubscribeAll)).subscribe((item) => {

      this.not_usedImages = item;
    });

    this.subCollections = (await this.imageItemIndexService
      .getImagesByType(this.productId)).pipe(takeUntil(this._unsubscribeAll)).subscribe((item) => {
        this.collectionsImages = item;
      });
  }

  ngOnInit() {
    // convert images to format of imageList
    // this.deleteDupes.deleteDuplicateImages();
    this.Refresh();
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
    imageItem: any,
    currentIndex: number,
    newContainerId: string
  ) {
    if (newContainerId !== this.IN_NOT_USED) {
      imageItem.forEach((element: any) => {
        element.ranking = imageItem.indexOf(element);
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

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
