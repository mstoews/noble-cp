import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { ImageItemIndex } from 'app/5.models/imageItem';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { MatDialog } from '@angular/material/dialog';
import { DeleteDuplicateService } from 'app/4.services/delete-duplicate.service';
import { DndComponent } from 'app/3.components/loaddnd/dnd.component';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';

@Component({
  selector: 'image-maintenance',
  templateUrl: './image-maintenance.component.html',
  styleUrls: ['./image-maintenance.component.css'],
})
export class ImageMaintenanceComponent implements OnInit, OnDestroy {
  onTabClick($event: any) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('drawer') drawer: MatDrawer;
  drawOpen: 'open' | 'close' = 'open';
  imageGroup: FormGroup;
  onUpdate: any;
  cRAG: any;
  sTitle: any;
  currentImage: ImageItemIndex;

  IN_NOT_USED = 'IN_NOT_USED';
  IN_COLLECTION = 'IN_COLLECTION';
  IN_GALLERY = 'IN_GALLERY';
  IN_PRODUCTS = 'IN_PRODUCTS';

  subNotUsed: Subscription;
  subCollections: Subscription;
  subGallery: Subscription;
  subProducts: Subscription;

  not_usedImages: ImageItemIndex[] = [];
  collectionsImages: ImageItemIndex[] = [];
  galleryImages: ImageItemIndex[] = [];
  productsImages: ImageItemIndex[] = [];

  constructor(
    public imageItemIndexService: ImageItemIndexService,
    public duplicateService: DeleteDuplicateService,
    private matDialog: MatDialog,
    private fb: FormBuilder
  ) {}

  RefreshList() {

    alert('RefreshList');

  }

  RefreshImageList() {

    alert('RefreshImageList');
  }
  DeleteDupes() {

    alert('DeleteDupes');
  }

  RefreshImages() {

    alert('RefreshImages');
  }

  onImageSelected(e: any) {
    console.debug('onImageSelected: ' + JSON.stringify(e));
  }

  createImageOnce() {
    this.onImages();
  }

  onImages() {
    const parentId = '';
    const dialogRef = this.matDialog.open(DndComponent, {
      width: '500px',
      data: {
        parent: '',
        location: 'inventory',
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

  Refresh() { }

  createEmptyForm() {
    this.imageGroup = this.fb.group({
      parentId: [''],
      caption: [''],
      imageAlt: [''],
      imageSrc: [''],
      ranking: [''],
      type: [''],
    });
  }

  ngOnInit() {
    this.createEmptyForm();
    this.Refresh();
  }

  onOpenDrawer($event: any) {
    // console.debug('onOpenDrawer', $event);
    this.toggleDrawer();
  }

  Clone() {
    throw new Error('Method not implemented.');
  }

  Add() {
    // console.debug('toggle drawer');
    this.toggleDrawer();
  }

  Delete() {
    throw new Error('Method not implemented.');
  }

  toggleDrawer() {
    const opened = this.drawer.opened;
    if (opened !== true) {
      this.drawer.toggle();
    } else {
      if (this.drawOpen === 'close') {
        this.drawer.toggle();
      }
    }
  }

  closeDrawer() {
    throw new Error('Method not implemented.');
  }

  onDelete(arg0: any) {
    throw new Error('Method not implemented.');
  }
  onCreate(arg0: any) {
    throw new Error('Method not implemented.');
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
    this.subNotUsed.unsubscribe();
    this.subCollections.unsubscribe();
    this.subGallery.unsubscribe();
    this.subProducts.unsubscribe();

  }
}
