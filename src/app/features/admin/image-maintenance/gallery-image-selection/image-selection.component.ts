import {
  Component, OnInit, OnDestroy, Input,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, Subscription, map, pipe, takeUntil } from 'rxjs';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';


import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ProductsService } from 'app/4.services/products.service';
import { DeleteDuplicateService } from 'app/4.services/delete-duplicate.service';
import { ImageItemIndex } from 'app/5.models/imageItem';

@Component({
  selector: 'gallery-img-selection',
  templateUrl: './image-selection.component.html',
  styleUrls: ['./image-selection.component.css'],
})
export class GalleryImageSelectionComponent implements OnInit, OnDestroy {
  @Input() productId: string;

  currentImage: ImageItemIndex;

  _unsubscribeAll: Subject<any> = new Subject<any>();

  IN_NOT_USED = 'IN_NOT_USED';
  IN_DELETED = 'IN_DELETED';
  IN_COLLECTION = 'IN_COLLECTION';

  not_usedImages: ImageItemIndex[] = [];
  deletedImages: ImageItemIndex[] = [];
  collectionsImages: ImageItemIndex[] = [];
  inventoryImages$: Observable<ImageItemIndex[]>;
  firstRun: boolean = true;

  constructor(
    public imageItemIndexService: ImageItemIndexService,
    public productService: ProductsService,
    public deleteDupes: DeleteDuplicateService,
    private fb: FormBuilder
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
    return (await this.imageItemIndexService.getOriginalImageListByType('IN_NOT_USED')).pipe(
      map((data) => {
        data.sort((a, b) => {
          return a.caption < b.caption ? -1 : 1;
        });
        return data;
      })
    );
  }

  public async Refresh() {
    (await this.imageItemIndexService.sortNotUsed())
      .pipe(takeUntil(this._unsubscribeAll)).subscribe((item) => {
        this.not_usedImages = item;
      });

    (await this.imageItemIndexService.getImageByType(this.productId))
      .pipe(takeUntil(this._unsubscribeAll)).subscribe((item) => {
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }
}
