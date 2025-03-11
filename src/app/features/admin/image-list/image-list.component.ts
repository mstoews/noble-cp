import { Component, OnDestroy } from '@angular/core';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';
import { ImageItemIndex } from '../../../5.models/imageItem';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css'],
})
export class ImageListComponent implements OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  IN_NOT_USED = 'IN_NOT_USED';
  IN_FEATURED = 'IN_FEATURED';
  IN_COLLECTION = 'IN_COLLECTION';
  IN_CREATION = 'IN_CREATION';
  IN_GALLERY = 'IN_GALLERY';

  not_usedImages: ImageItemIndex[] = [];
  featuredImages: ImageItemIndex[] = [];
  collectionsImages: ImageItemIndex[] = [];
  creationsImages: ImageItemIndex[] = [];
  galleryImages: ImageItemIndex[] = [];

  constructor(
    public imageItemIndexService: ImageItemIndexService,
    private fb: FormBuilder
  ) {}

  async Refresh() {
     (
      await (
        await this.imageItemIndexService.getImageByType(this.IN_NOT_USED)
      ).pipe(takeUntil(this._unsubscribeAll)) ).subscribe((item) => {
      this.not_usedImages = item;
    });
     (
      await (
        await this.imageItemIndexService.getImageByType(this.IN_FEATURED)).pipe(takeUntil(this._unsubscribeAll)) ).subscribe((item) => {
        this.featuredImages = item;
    });
     (
      await (
        await this.imageItemIndexService.getImageByType(this.IN_COLLECTION)).pipe(takeUntil(this._unsubscribeAll))).subscribe((item) => {
        this.collectionsImages = item;
    });
    (
      await (
        await this.imageItemIndexService.getImageByType(this.IN_CREATION)).pipe(takeUntil(this._unsubscribeAll))).subscribe((item) => {
        this.creationsImages = item;
    });
     (
      await this.imageItemIndexService.getImageByType(this.IN_GALLERY)).pipe(takeUntil(this._unsubscribeAll)) .subscribe((item) => {
        this.galleryImages = item;
    });
  }

  ngOnInit() {
    this.Refresh();
  }

  drop(event: CdkDragDrop<ImageItemIndex[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateRanking(event.container.data);
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
        event.container.id
      );
    }
  }

  private updateRanking(previousData: any[]) {
    // loop through just the previous day
    // previous status is the same so not updated
    const cnt = previousData.length;
    if (cnt > 0) {
      let i = 1;
      previousData.forEach((image) => {
        image.ranking = i;
        this.imageItemIndexService.updateImageList(image);
        i++;
      });
    }
  }

  private updateImageType(
    previousData: any,
    newData: any,
    newContainerId: string
  ) {
    const cnt = newData.length;
    if (cnt > 0) {
      let i = 1;
      newData.forEach((image: any) => {
        image.ranking = i;
        image.type = newContainerId;
        this.imageItemIndexService.updateImageList(image);
        i++;
      });
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
