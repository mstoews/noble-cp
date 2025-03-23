import { ImageItemIndex } from 'app/models/imageItem';
import { Observable, Subscription, map, of } from 'rxjs';
import { Injectable, OnDestroy, inject } from '@angular/core';

import { collectionData, docData } from 'rxfire/firestore';
import { StorageReference, getDownloadURL, getMetadata, listAll, ref } from 'firebase/storage';
import { doc, DocumentReference, updateDoc, collection, addDoc, deleteDoc } from 'firebase/firestore';

import { FIRESTORE } from 'app/app.config';
import { STORAGE } from 'app/app.config';

@Injectable({
  providedIn: 'root',
})
export class ImageItemIndexService implements OnDestroy {
  firestore = inject(FIRESTORE);
  storage = inject(STORAGE);

  private sub: Subscription;

  hashUsedImagesMap = new Map<string, ImageItemIndex>();
  hashOriginalIndexMap = new Map<string, ImageItemIndex>();
  hashImageItemMap = new Map<string, ImageItemIndex>();

  getAll(): Observable<ImageItemIndex[]> {
    const collectionRef = collection(this.firestore, 'originalImageList');
    return collectionData(collectionRef, { idField: 'id' }) as Observable<ImageItemIndex[] >;
  }

  getById(id: string) {
    const collectionRef = collection(this.firestore, 'originalImageList');
    const blog = doc(collectionRef, id);
    return docData(blog) as Observable<ImageItemIndex>;
  }

  // Add
  add(imageItemIndex: ImageItemIndex) {
    return addDoc(collection(this.firestore, 'originalImageList'), imageItemIndex );
  }

  createOriginalItem(image: ImageItemIndex) {
    this.add(image);
  }

  update(imageItemIndex: any) {
    const ref = doc(
      this.firestore,
      'originalImageList',
      imageItemIndex.id
    ) as DocumentReference<ImageItemIndex>;
    return updateDoc(ref, imageItemIndex);
  }

  updateImageList(item: ImageItemIndex) {
    this.update(item);
  }

  // Delete
  delete(id: number) {
    const ref = doc(this.firestore, 'originalImageList', id.toString());
    deleteDoc(ref).then(() => {
      console.log('Document successfully deleted!');
    }
    ).catch((error) => {
      console.error('Error removing document: ', error);
    }
    );
  }

  reNumber(type: string) {
    let ranking = 0;
    this.sub = this.getAllImages(type).subscribe((images) => {
      images.forEach((image) => {
        image.ranking = ranking;
        ranking++;
        this.update(image);
      });
    });
  }

  
  async getImagesByType(productId: string) {
    return this.getImageByType(productId);
  }

  updateCollectionDescription(imgItem: ImageItemIndex) {
    this.update(imgItem);
  }

  setCollectionDescription(imgItem: ImageItemIndex) {
    this.update(imgItem);
  }

  async getImageIndexList() {
    return this.getAll();
  }

  async sortNotUsed() {
    return (await this.getOriginalImageListByType('IN_NOT_USED')).pipe(
      map((data) => {
        data.sort((a, b) => {
          return a.caption < b.caption ? -1 : 1;
        });
        return data;
      })
    );
  }

  getAllImages(type: string) {
    if (type === null || type === undefined || type === '') {
      return this.getAll();
    } else {
      return this.getAll().pipe(
        map((images) => images.filter((types) => types.type === type))
      );
    }
  }

  getImagesByTypeId(id: string) {
    return this.getAll().pipe(
      map((images) => images.filter((filter) => filter.id === id))
    );
  }

  async getImageByType(type: string) {
    return this.getAll().pipe(
      map((images) => images.filter((filter) => filter.type === type))
    );
  }

  async getImagesByCategory(category: string) {
    return this.getAll().pipe(
      map((images) => images.filter((filter) => filter.category === category))
    );
  }

  async getOriginalImageListByType(type: string) {
    return this.getAll().pipe(
      map((images) => images.filter((filter) => filter.type === type))
    );
  }

  async createOriginalIndexMaps(): Promise<void> {
    this.hashOriginalIndexMap.clear();
    this.getAllImages('').subscribe((images) => {
      images.forEach((image) => {
        this.hashOriginalIndexMap.set(image.fileName, image);
      });
    });
  }

  getUsedImagesList() {
    return this.getAll().pipe(
      map((images) => images.filter((filter) => filter.type !== 'IN_NOT_USED'))
    );
  }

  async getImageURL(
    ref: StorageReference,
    imageDt: any,
    file: File,
    path: string
  ) {
    let updated = false;
    let downloadUrl = getDownloadURL(ref);
    const typeId = imageDt.parent;
    if (downloadUrl !== undefined && updated === false) {
      downloadUrl
        .then((dw) => {
          const ImageItemIndex = {
            parentId: '',
            caption: imageDt.caption,
            fileName: file.name,
            fullPath: path,
            imageSrc: dw,
            imageSrc200: dw,
            imageSrc400: dw,
            imageSrc800: dw,
            ranking: 0,
            size: 'original',
            type: typeId,
            id: '',
            contentType: file.type,
          };
          this.createOriginalItem(ImageItemIndex);
          updated = true;
        })
        .catch((error) => {
          console.error('Error getting download URL', error);
        });
    }
  }

  async updateUsedImageList(): Promise<void> {
    this.hashUsedImagesMap.forEach((value, key) => {
      var fileExt = value.imageAlt.split('.').pop();
      let fileName = value.imageAlt.replace(/\.[^/.]+$/, '');
      fileName = fileName.replace(`thumbnails/`, '').replace(`_200x200`, '');
      fileName = fileName.replace(`400/`, '').replace(`_400x400`, '');
      fileName = fileName.replace(`800/`, '').replace(`_800x800`, '');
      fileName = `${fileName}.${fileExt}`;
      let usedItem = this.hashOriginalIndexMap.get(fileName);
      if (usedItem !== undefined) {
        usedItem.type = value.type;
        usedItem.caption = value.caption;
        usedItem.ranking = value.ranking;
        usedItem.parentId = value.parentId;
        usedItem.imageSrc = value.imageSrc;
        this.update(usedItem);
      }
    });
  }

  async updateMainImageList(): Promise<void> {
    let ranking = 0;
    const listRef = ref(this.storage, '/');
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
            console.debug('Map Size', this.hashImageItemMap.size);
            const file = this.hashImageItemMap.get(imageData.fileName);

            if (file === undefined || file === null) {
                this.setCollectionDescription(imageData);
                console.debug(`Added ${imageData.fileName}`);
            }
          });
        });
        console.debug('createRawImagesList_200 completed');
      });
    });
  }

  ngOnDestroy(): void {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

}
