import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Input,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription, map } from 'rxjs';

import { ImageItemIndex } from 'app/models/imageItem';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ImageItemIndexService } from 'app/services/image-item-index.service';
import { DeleteDuplicateService } from '../../shop-services/delete-duplicate.service';
import { ProductsService } from '../../shop-services/products.service';

@Component({
  selector: 'thoughts-img-selection',
  templateUrl: './thoughts-image-selection.component.html',
  styleUrls: ['./thoughts-image-selection.component.css'],
})
export class ThoughtsImageSelectionComponent implements OnInit, OnDestroy {
  @Input() productId: string;

  constructor(
    private imageItemIndexService: ImageItemIndexService,
    private productService: ProductsService,
    private deleteDupes: DeleteDuplicateService,
    private fb: FormBuilder
  ) {}

  currentImage: ImageItemIndex;

  IN_NOT_USED = 'IN_NOT_USED';
  IN_DELETED = 'IN_DELETED';
  IN_COLLECTION = 'IN_COLLECTION';

  subNotUsed: Subscription;

  subCollections: Subscription;

  not_usedImages: ImageItemIndex[] = [];

  collectionsImages: ImageItemIndex[] = [];
  firstRun: boolean = true;

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

  sortNotUsed() {
    return this.imageItemIndexService.getAllImages(null).pipe(
      map((data) => {
        data.sort((a, b) => {
          return a.caption < b.caption ? -1 : 1;
        });
        return data;
      })
    );
  }

  async Refresh() {
    this.subNotUsed = this.sortNotUsed().subscribe((item) => {
      this.not_usedImages = item;
    });

    this.subCollections = (
      await this.imageItemIndexService.getImagesByType(this.productId)
    ).subscribe((item) => {
      this.collectionsImages = item;
    });
  }

  ngOnInit() {
    // convert images to format of imageList
    // this.deleteDupes.deleteDuplicateImages();
    this.Refresh();
  }

  onTabClick(event: any) {
    // console.debug('onTabClick', event);
    //this.Refresh();
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
    this.subNotUsed.unsubscribe();
    this.subCollections.unsubscribe();
  }
}
