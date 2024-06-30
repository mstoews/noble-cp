import { DocumentReference, addDoc, collection, doc, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, Subject, first, map, takeUntil } from 'rxjs';

import { Firestore } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { ImageItemIndex } from 'app/models/imageItem';
import { convertSnaps } from './db-utils';

@Injectable({
  providedIn: 'root',
})
export class UpdateImageService implements OnDestroy {
  constructor() {
    this.createOriginalIndexMaps();
  }

  firestore = inject(Firestore);
  storage = inject(Storage);

  hashOriginalIndexMap = new Map<string, ImageItemIndex>();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  updateImageList(): void {
    this.updateImageIndexList('200');
    this.updateImageIndexList('400');
    this.updateImageIndexList('800');
  }

  updateImageIndexList(size: string): void {
    console.debug('Number of image items', this.hashOriginalIndexMap.size);

    if (this.hashOriginalIndexMap.size > 0) {
      this.hashOriginalIndexMap.forEach((value, key) => {
        let imageSrc200 = value.imageSrc200;
        let imageSrc400 = value.imageSrc400;
        let imageSrc800 = value.imageSrc800;

        var fileExt = value.fileName.split('.').pop();
        let fileName = value.fileName.replace(/\.[^/.]+$/, '');

        fileName = fileName
          .replace(`/${size}`, '')
          .replace(`_${size}x${size}`, '');

        switch (size) {
          case '200':
            if (imageSrc200 === undefined || imageSrc200 === null) {
              imageSrc200 = '';
            } else {
              break;
            }
            fileName = `/thumbnails/${fileName}_${size}x${size}.${fileExt}`;

            this.storage
              .ref(fileName)
              .getDownloadURL()
              .subscribe((smallSrc) => {
                console.debug(smallSrc);
                value.imageSrc200 = smallSrc;
                this.update(value);
              });
            break;

          case '400':
            if (imageSrc400 === undefined || imageSrc400 === null) {
              imageSrc400 = '';
            } else {
              break;
            }
            fileName = `/${size}/${fileName}_${size}x${size}.${fileExt}`;
            this.storage
              .ref(fileName)
              .getDownloadURL()
              .subscribe((mediumSrc) => {
                value.imageSrc400 = mediumSrc;
                this.update(value);
              });
            break;

          case '800':
            if (imageSrc800 === undefined || imageSrc800 === null) {
              imageSrc800 = '';
            } else {
              break;
            }
            fileName = `/${size}/${fileName}_${size}x${size}.${fileExt}`;
            this.storage
              .ref(fileName)
              .getDownloadURL()
              .subscribe((largeSrc) => {
                console.debug(largeSrc);
                value.imageSrc800 = largeSrc;
                this.update(value);
              });
            break;
          default:
            break;
        }
      });
    } else {
      alert('No images to update');
    }
  }

  updateOriginalImageList(): void {
    let ranking = 0;
    this.storage
      .ref('/')
      .listAll()
      .subscribe((files) => {
        files.items.forEach((imageRef) => {
          imageRef.getDownloadURL().then((downloadURL) => {
            imageRef.getMetadata().then((meta) => {
              meta.contentType;

              const imageUrl = downloadURL;
              const imageData: ImageItemIndex = {
                parentId: '',
                category: 'IN_NOT_USED',
                caption: imageRef.fullPath,
                type: 'IN_NOT_USED',
                imageSrc: imageUrl,
                fullPath: imageRef.fullPath,
                fileName: imageRef.name,
                size: 'original',
                imageAlt: imageRef.name,
                ranking: ranking,
                contentType: meta.contentType,
                id: '',
              };

              console.debug('Map Size', this.hashOriginalIndexMap.size);

              const file = this.hashOriginalIndexMap.get(imageData.fileName);
              if (file === undefined || file === null) {
                this.addOriginalImageList(imageData);
                this.hashOriginalIndexMap.set(imageData.fileName, imageData);
              }
            });
          });
          console.debug('createRawImagesList_200 completed');
        });
      });
  }

  addOriginalImageList(imageData: ImageItemIndex): boolean {
    let added = false;
    this.findProductByUrl(imageData.fileName).subscribe((image) => {
      if (image === undefined) {
        this.add(imageData);
        added = true;
      }
    });
    return added;
  }

  getAll(): Observable<ImageItemIndex[]> {
    const collectionRef = collection(this.firestore, 'originalImageList');
    const q = query(collectionRef, orderBy('ranking'));
    return collectionData(q, { idField: 'id' }) as Observable<ImageItemIndex[]>;
  }

  add(imageItemIndex: ImageItemIndex) {
    return addDoc(collection(this.firestore, 'category'), imageItemIndex);
  }

  update(imageItemIndex: any) {
    const ref = doc(
      this.firestore,
      'originalImageList',
      imageItemIndex.id
    ) as DocumentReference<ImageItemIndex>;
    return updateDoc(ref, imageItemIndex);
  }

  findProductByUrl(fileName: string): Observable<ImageItemIndex[]> {
    const collectionRef = collection(this.firestore, 'originalImageList');
    const q = query(collectionRef, where('fileName', '==', fileName));
    return collectionData(q, { idField: 'id' }) as Observable<ImageItemIndex[]>;
  }

  createOriginalIndexMaps(): void {
    this.hashOriginalIndexMap.clear();
    this.getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((images) => {
        images.forEach((image) => {
          this.hashOriginalIndexMap.set(image.fileName, image);
        });
        console.debug(this.hashOriginalIndexMap.size);
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
