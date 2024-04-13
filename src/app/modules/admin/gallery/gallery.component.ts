import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { IImageStorage } from 'app/5.models/maintenance';
import { Subject, takeUntil } from 'rxjs';

interface Item {
  imageSrc: string;
  imageAlt: string;
}

@Component({
  selector: 'app-gallery-mozaic',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent implements OnInit, OnDestroy {
  inventoryImages: Item[] = [];
  imagesArray: IImageStorage[] = [];
  allImagesArray: IImageStorage[] = [];

  constructor(public storage: Storage) {}

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  ngOnInit(): void {
    this.ImagesList();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ImagesList() {
    var imageCount = 0;
    this.storage
      .ref('/400')
      .listAll().pipe(takeUntil(this._unsubscribeAll))
      .subscribe((files) => {
        files.items.forEach((imageRef) => {
          imageCount++;
          imageRef.getDownloadURL().then((downloadURL) => {
            const imageUrl = downloadURL;
            const imageData: IImageStorage = {
              name: 'image',
              parentId: 'parent',
              url: imageUrl,
              version_no: imageCount,
            };
            this.imagesArray.push(imageData);
          });
        });
      });
  }
}
