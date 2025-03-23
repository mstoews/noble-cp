import { inject, Injectable } from '@angular/core';
import { ImageItem } from '../models/imageItem';
import { rawImageItem } from '../models/rawImagesList';
import { Observable, BehaviorSubject, map, first, of } from 'rxjs';
import { collectionData, docData } from 'rxfire/firestore';
import { doc, DocumentReference, updateDoc, collection, addDoc, deleteDoc } from 'firebase/firestore';

import { FIRESTORE, STORAGE } from 'app/app.config';

@Injectable({
  providedIn: 'root',
})
export class ImageListService {
  private imageItemCollections: Observable<ImageItem[]>;
  private rawImageItems: Observable<rawImageItem[]>;
  private imageItems: Observable<ImageItem[]>;
  
  items$: Observable<ImageItem[]>;
  typeFilter$: BehaviorSubject<string | null>;
  rawImagesArray: ImageItem[] = [];

  afs = inject(FIRESTORE);
  storage = inject(STORAGE);

  constructor() {
    const collectionRef = collection(this.afs, 'imagelist');
  }

  getImagesList(): Observable<ImageItem[]> {
    const imagesRef = collection(this.afs, 'imagelist');
    return collectionData(imagesRef, { idField: 'id' }) as Observable<ImageItem[]>;
  }

  getAllRawImages() {
    return this.rawImageItems;
  }

  readAll() {
    return this.imageItems;
  }

  readImagesByType(imageType: string) {
    return this.imageItems.pipe(
      map((images) => images.filter((type) => type.type === imageType))
    );
  }

  findImagesByProductId(productId: string): Observable<ImageItem[]> {
    const ref = collection(this.afs ,'imageList')
    return collectionData(ref, { idField: 'id' }).pipe(
      map((images) => images.filter((image) => image.parentId === productId)) ) as Observable<ImageItem[]>;
  }

  insertImageList(image: ImageItem) {
    addDoc(collection(this.afs, 'imagelist'), image);
  }

  createImageList() {
    const rawImage = this.getAllRawImages();
    var count = 0;
    rawImage.subscribe((image) => {
      image.forEach((img) => {
        count++;
        if (img.id != undefined) {
          const item = {
            id: '',
            parentId: img.id as string,
            caption: img.caption,
            imageSrc: img.imageSrc,
            imageAlt: img.imageAlt,
            type: img.type,
            ranking: count,
          };
          this.createItem(item);
        }
      });
    });
  }

  read() {
    return this.imageItems;
  }

  readNotUsed() {
    return this.imageItems;
  }

  readId(id: string) {  
    return this.imageItemCollections.subscribe((imageList) => {
      imageList.forEach((img) => {
        if (img.id === id) {
          return img;
        }
      });
    });
  }
  
  getItemsByType(type: string) {

  }

  createItem(image: ImageItem) {
    addDoc(collection(this.afs, 'imagelist'), image).then((imgItem) => {
        image.id = imgItem.id;
        // updateDoc(doc(this.afs, 'imagelist', imgItem.id), image);
    });
  }

  update(item: ImageItem, productId: string) {
    // console.debug(JSON.stringify(item));
    item.parentId = productId;
        //this.updateInventory(item, productId)
  }

  updateImageList(item: ImageItem) {
    // this.imageItemCollections.doc(item.id).update(item);
  }

  delete(id: string) {
    deleteDoc(doc(this.afs, 'imagelist', id));    
  }

  // creates a list of all images currently names in the imae
  updateRawImageList() {
    this.rawImagesArray = [];
    this.readAll().subscribe((imageList) => {
      this.rawImagesArray = imageList;
    });
  }

  createRawImagesList() {
    this.updateRawImageList();
    let ranking = 0;

    // this.storage.ref('/documents')
    //   .listAll()
    //   .subscribe((files) => {
    //     files.items.forEach((imageRef) => {
    //       imageRef.getDownloadURL().then((downloadURL) => {
    //         ranking++;
    //         const imageUrl = downloadURL;
    //         const imageData: imageItem = {
    //           id: '',
    //           parentId: '',
    //           caption: imageRef.fullPath,
    //           type: 'IN_NOT_USED',
    //           imageSrc: imageUrl,
    //           imageAlt: imageRef.name,
    //           ranking: ranking,              
    //         };
    //         let found = false;
    //         this.rawImagesArray.forEach((img) => {
    //           if (img.imageAlt === imageData.imageAlt) {
    //             found = true;
    //           }
    //         });
    //         if (!found) {
    //           this.createItem(imageData);
    //         }
    //       });
    //     });
    //   });
  }
}
