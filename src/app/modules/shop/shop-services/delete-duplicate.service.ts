import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';

import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  updateDoc,
  query,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { ImageItemIndex, imageItemIndexMap } from 'app/models/imageItem';
import {
  Observable,
  Subject,
  Subscription,
  filter,
  map,
  shareReplay,
  takeUntil,
} from 'rxjs';
import { rawImageItem } from 'app/models/rawImagesList';

import {
  getStorage,
  ref,
  getDownloadURL,
  listAll,
  getMetadata,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class DeleteDuplicateService implements OnDestroy {
  constructor() {
    this.createOriginalIndexMaps();
  }

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  // Inject dependencies
  afs = inject(Firestore);
  storage = getStorage();

  // local variables
  imageIndexArray: ImageItemIndex[] = [];
  // rawIndexArray: imageItem[] = [];

  hashOriginalIndexMap = new Map<string, ImageItemIndex>();
  // hashImageItemMap = new Map<string, imageItem>();

  sub: Subscription;

  imageIndexMap: imageItemIndexMap = {};

  private rawImageItems: Observable<rawImageItem[]>;

  // imageIndexCollections = this.afs.collection<ImageItemIndex>('originalImageList');
  // imageIndexItems = this.imageIndexCollections.valueChanges({ idField: 'id', });

  createOriginalItem(image: ImageItemIndex) {
    // this.imageIndexCollections.add(image).then((imgIndex) => {
    //   this.imageIndexCollections.doc(imgIndex.id).update(imgIndex);
    // });
  }

  getAll(): Observable<ImageItemIndex[]> {
    const collectionRef = collection(this.afs, 'originalImageList');
    const q = query(collectionRef, orderBy('ranking'));
    return collectionData(q, { idField: 'id' }) as Observable<ImageItemIndex[]>;
  }

  getById(id: string) {
    const collectionRef = collection(this.afs, 'originalImageList');
    const image = doc(collectionRef, id);
    return docData(image) as Observable<ImageItemIndex>;
  }

  // Add
  add(imageItemIndex: ImageItemIndex) {
    return addDoc(collection(this.afs, 'category'), imageItemIndex);
  }

  // Update

  update(imageItemIndex: any) {
    const ref = doc(
      this.afs,
      'originalImageList',
      imageItemIndex.id
    ) as DocumentReference<ImageItemIndex>;
    return updateDoc(ref, imageItemIndex);
  }

  // Delete
  delete(id: string) {
    const ref = doc(this.afs, 'originalImageList', id);
    return deleteDoc(ref);
  }

  async onUpdateImageList(allImages: ImageItemIndex[]) {
    if (allImages.length > 0) {
      allImages.forEach((item) => {
        this.hashOriginalIndexMap.set(item.fileName, item);
      });
    }

    const listRef = ref(this.storage, '/');

    let ranking = 0;
    listAll(listRef).then((files) => {
      files.items.forEach((imageRef) => {
        getDownloadURL(imageRef).then((downloadURL) => {
          getMetadata(imageRef).then((meta) => {
            meta.contentType;

            const imageUrl = downloadURL;
            const imageData: ImageItemIndex = {
              parentId: '',
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

            const file = this.hashOriginalIndexMap.get(imageData.fileName);
            if (file === undefined || file === null) {
              this.createImageItem(imageData);
              console.debug(`Added ${imageData.fileName}`);
            }
          });
        });
      });
    });
  }

  async createImageItem(image: ImageItemIndex) {
    await this.add(image);

    // await this.imageIndexCollections.add(image).then((imgItem) => {
    //   image.id = imgItem.id;
    //   this.imageIndexCollections.doc(imgItem.id).update(image);
    //   this.updateImageIndexByFileName(image.fileName);
    // });
  }

  async getImageIndexList() {
    return this.getAll();
  }

  async createOriginalIndexMaps(): Promise<void> {
    this.hashOriginalIndexMap.clear();
    (await this.getImageIndexList()).subscribe(async (items) => {
      items.forEach((item) => {
        this.hashOriginalIndexMap.set(item.fileName, item);
      });
    });
  }

  // async createUsedImageMaps(): Promise<void> {
  //   this.hashUsedImagesMap.clear();
  //   (await this.getUsedImagesList()).subscribe(async (items) => {
  //     items.forEach((item) => {
  //       this.hashUsedImagesMap.set(item.id, item);
  //     });
  //   });
  // }

  // async createImageListMap(): Promise<void> {
  //   this.hashImageItemMap.clear();
  //   (await this.getImagesBySize('200')).subscribe(async (items) => {
  //     items.forEach((item) => {
  //       this.hashImageItemMap.set(item.imageAlt, item);
  //     });
  //   });
  // }

  // async createMainImageList(): Promise<void> {
  //   console.debug(this.hashOriginalIndexMap.size);
  //   const listRef = ref(this.storage, '/');
  //   listAll(listRef).then((files) => {
  //     files.items.forEach((imageRef) => {
  //       getDownloadURL(imageRef).then((downloadURL) => {
  //         getMetadata(imageRef).then((meta) => {
  //           const imageData: ImageItemIndex = {
  //             id: '',
  //             fullPath: meta.fullPath,
  //             size: 'original',
  //             fileName: meta.name,
  //             contentType: meta.contentType,
  //           };
  //           if (
  //             this.hashOriginalIndexMap.get(imageData.fileName) === undefined
  //           ) {
  //             this.updateIndexItem(imageData);
  //             console.debug(`Added ${imageData.fileName}`);
  //           }
  //         });
  //       });
  //     });
  //   });
  // }

  // getAllImages(type: string) {
  //   if (type === null || type === undefined || type === '') {
  //     return this.getAll().pipe(map((images) => images.filter((types) => types)));

  //   } else {
  //     let imageIndexCollections = this.afs.collection<ImageItemIndex>(
  //       'originalImageList',
  //       (ref) => ref.orderBy('ranking')
  //     );
  //     let imageIndexItems = imageIndexCollections
  //       .valueChanges({ idField: 'id' })
  //       .pipe(map((images) => images.filter((types) => types.type === type)));
  //     return imageIndexItems;
  //   }
  // }

  // async updateImageBySize(image: ImageItemIndex, size: string): Promise<void> {
  //   var fileExt = image.fileName.split('.').pop();
  //   var fileName = image.fileName.replace(/\.[^/.]+$/, '');
  //   fileName = fileName.replace(`/${size}`, '').replace(`_${size}x${size}`, '');
  //   if (size === '200') {
  //     fileName = `/thumbnails/${fileName}_${size}x${size}.${fileExt}`;
  //   } else {
  //     fileName = `/${size}/${fileName}_${size}x${size}.${fileExt}`;
  //   }
  //   this.storage
  //     .ref(fileName)
  //     .getDownloadURL()
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe((scr) => {
  //       if (size === '200') image.imageSrc200 = scr;
  //       if (size === '400') image.imageSrc400 = scr;
  //       if (size === '800') image.imageSrc800 = scr;
  //       this.imageIndexCollections.doc(image.id).update(image);
  //     });
  // }

  async updateImageIndexByFileName(fileName: string): Promise<void> {
    console.debug(this.hashOriginalIndexMap.size);

    let value = this.hashOriginalIndexMap.get(fileName);

    console.debug(JSON.stringify(value));

    if (value !== undefined || this.hashOriginalIndexMap.size > 0) {
      // this.updateImageBySize(value, '200');
      // this.updateImageBySize(value, '400');
      // this.updateImageBySize(value, '800');
    } else {
      return null;
    }
  }

  // async updateImageIndexList(size: string): Promise<void> {
  //   console.debug(this.hashOriginalIndexMap.size);

  //   this.hashOriginalIndexMap.forEach((value, key) => {
  //     var fileExt = value.fileName.split('.').pop();
  //     let fileName = value.fileName.replace(/\.[^/.]+$/, '');
  //     fileName = fileName
  //       .replace(`/${size}`, '')
  //       .replace(`_${size}x${size}`, '');

  //     switch (size) {
  //       case '200':
  //         fileName = `/thumbnails/${fileName}_${size}x${size}.${fileExt}`;
  //         this.storage
  //           .ref(fileName)
  //           .getDownloadURL()
  //           .subscribe((smallSrc) => {
  //             console.debug(smallSrc);
  //             value.imageSrc200 = smallSrc;
  //             this.imageIndexCollections.doc(value.id).update(value);
  //           });
  //         break;

  //       case '400':
  //         fileName = `/${size}/${fileName}_${size}x${size}.${fileExt}`;
  //         this.storage
  //           .ref(fileName)
  //           .getDownloadURL()
  //           .subscribe((mediumSrc) => {
  //             value.imageSrc400 = mediumSrc;
  //             this.imageIndexCollections.doc(value.id).update(value);
  //             //this.imageItemCopyCol.doc(imgItem.id).update(imgItem);
  //           });
  //         break;

  //       case '800':
  //         fileName = `/${size}/${fileName}_${size}x${size}.${fileExt}`;
  //         this.storage
  //           .ref(fileName)
  //           .getDownloadURL()
  //           .subscribe((smallSrc) => {
  //             console.debug(smallSrc);
  //             value.imageSrc800 = smallSrc;
  //             this.imageIndexCollections.doc(value.id).update(value);
  //           });
  //         break;
  //       default:
  //         let fileNameDefault = `/${value.fileName}`;
  //         this.storage
  //           .ref(fileNameDefault)
  //           .getDownloadURL()
  //           .subscribe((data) => {
  //             console.debug(data);
  //           });
  //         break;
  //     }
  //   });
  // }

  // async getImgFromServer(imgItem: imageItem): Promise<string> {
  //   let img = '';
  //   let size = '';
  //   if (imgItem.imageAlt.includes('200')) {
  //     size = '200';
  //   }
  //   if (imgItem.imageAlt.includes('400')) {
  //     size = '400';
  //   }
  //   if (imgItem.imageAlt.includes('800')) {
  //     size = '800';
  //   }

  //   var fileExt = imgItem.imageAlt.split('.').pop();
  //   let fileName = imgItem.imageAlt.replace(/\.[^/.]+$/, "");
  //   fileName = fileName.replace(`/${size}`,'').replace(`_${size}x${size}`,'');

  //   switch (size) {
  //     case '200':
  //       fileName = `/thumbnails/${fileName}_${size}x${size}.${fileExt}`;
  //       var pathReference = this.storage
  //         .ref(fileName)
  //         .getDownloadURL()
  //         .subscribe((smallSrc) => {
  //           console.debug(smallSrc);
  //           imgItem.imageSrc200 = smallSrc;
  //           imgItem.id = imgItem.imageAlt;

  //         });
  //       break;
  //     case '400':

  //     fileName = `/${size}/${fileName}_${size}x${size}.${fileExt}`;
  //       var pathReference = this.storage
  //         .ref(fileName)
  //         .getDownloadURL()
  //         .subscribe((smallSrc) => {
  //           console.debug(smallSrc);
  //           imgItem.imageSrc400 = smallSrc;
  //           imgItem.id = imgItem.imageAlt;
  //           //this.imageItemCopyCol.doc(imgItem.id).update(imgItem);
  //         });
  //       break;
  //     case '800':
  //       fileName = `/${size}/${fileName}_${size}x${size}.${fileExt}`;
  //       var pathReference = this.storage
  //         .ref(fileName)
  //         .getDownloadURL()
  //         .subscribe((smallSrc) => {
  //           console.debug(smallSrc);
  //           imgItem.imageSrc800 = smallSrc;
  //           imgItem.id = imgItem.imageAlt;
  //           //this.imageItemCopyCol.doc(imgItem.id).update(imgItem);
  //         });
  //       break;
  //     default:
  //       let fileNameDefault = `/thumbnails/${imgItem}`;
  //       var pathReferenceDefault = this.storage
  //         .ref(fileNameDefault)
  //         .getDownloadURL()

  //         .subscribe((data) => {
  //           console.debug(data);
  //           img = data;
  //         });
  //       break;
  //   }
  //   this.imageItemCollections.doc(imgItem.id).update(imgItem);
  //   return img;
  // }

  // getImagesList() {
  //   return this.imageItems.pipe(
  //     map((images) => images.filter((type) => type.type === 'IN_NOT_USED'))
  //   );
  // }

  // getUsedImagesList() {
  //   return this.imageItems.pipe(
  //     map((images) => images.filter((type) => type.type !== 'IN_NOT_USED'))
  //   );
  // }

  // updateIndexItem(imageData: ImageItemIndex) {
  //   this.imageIndexCollections.add(imageData).then((img) => {
  //     imageData.id = img.id;
  //     this.imageIndexCollections.doc(imageData.id).update(imageData);
  //   });
  // }

  // async getOriginalImagesList(): Promise<Observable<imageItem[]>> {
  //   const imagesRef = collection(this.afs.firestore, 'originalImageList');
  //   return collectionData(imagesRef, { idField: 'id' }) as Observable<
  //     imageItem[]
  //   >;
  // }

  // async getLargeImagesList(): Promise<Observable<imageItem[]>> {
  //   const imagesRef = collection(this.afs.firestore, 'largeImageList');
  //   return collectionData(imagesRef, { idField: 'id' }) as Observable<
  //     imageItem[]
  //   >;
  // }

  // async getMediumImagesList(): Promise<Observable<imageItem[]>> {
  //   const imagesRef = collection(this.afs.firestore, 'mediumImageList');
  //   return collectionData(imagesRef, { idField: 'id' }) as Observable<
  //     imageItem[]
  //   >;
  // }

  // async getSmallImagesList(): Promise<Observable<imageItem[]>> {
  //   const imagesRef = collection(this.afs.firestore, 'smallImageList');
  //   return collectionData(imagesRef, { idField: 'id' }) as Observable<
  //     imageItem[]
  //   >;
  // }

  // async deleteDupes(not_usedImages: imageItem[]) {
  //   let found = false;
  //   let dupes: string[] = [];
  //   this.rawIndexArray = [];
  //   not_usedImages.forEach(async (items) => {
  //     found = this.doesItemDuplicateExist(items, found);
  //     if (!found) {
  //       this.rawIndexArray.push(items);
  //     } else {
  //       dupes.push(items.id);
  //     }
  //     found = false;
  //   });
  //   return dupes;
  // }

  // doesItemDuplicateExist(image: imageItem, found: boolean): boolean {
  //   // have to have at least one item in the array
  //   found = false;
  //   this.imageIndexArray.forEach((img) => {
  //     if (img.fileName === image.imageAlt) {
  //       found = true;
  //     }
  //   });
  //   return found;
  // }

  // deletefFromFirebase(dupes: string[]) {
  //   console.debug(`Deleting duplicates :${dupes.length}`);
  //   dupes.forEach(async (dupeid) => {
  //     this.imageItemCollections.doc(dupeid).delete();
  //   });
  // }

  // Create and retrieve the original index image collection

  ImagesIndexArray: ImageItemIndex[];
}
