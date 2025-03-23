import { DocumentReference } from "firebase/firestore";

export interface ImageItem {
  id: string;
  parentId: string;
  imageSrc: string;
  imageAlt: string;
  caption: string;
  type: string;
  ranking?: number;
  description?: string;
  size?: string;
}

export interface ImageItemIndex {
  id: string;
  fullPath: string;
  size: string;
  fileName: string;
  contentType: string;
  imageSrc200?: string;
  imageSrc400?: string;
  imageSrc800?: string;
  type?: string;
  ranking?: number;
  description?: string;
  parentId?: string;
  imageSrc?: string;
  imageAlt?: string;
  caption?: string;
  category?: string;
}


export interface imageItemIndexMap {
  [key: string]: ImageItemIndex;
}

export interface imageItemPartial {
  id?: string;
  imageSrc: string;
  imageAlt: string;
  caption: string;
  type: string;
  description?: string;
}

interface HashMap<T> {
  [key: string]: T;
}


export type ListUpdate<T, K = any> = { key: T, item: K, type: 'added' | 'removed' }

export type OverviewUpdate = ListUpdate<'overview', string>;

export type ImageItemUpdate = ListUpdate<'image_item', string>;
export type ImageItemListUpdate = ImageItemUpdate | OverviewUpdate;

export type ImageItemRef = DocumentReference<ImageItem>;
export interface ImageItemSnap extends ImageItem {
    images: ImageItem[];
}


