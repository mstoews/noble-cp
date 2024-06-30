import { Time } from "@angular/common";
import { DocumentReference, Timestamp } from "firebase/firestore";

export interface Category {
  id?: string;
  name: string;
  description: string;
  jp_description?: string;
  image: string;
  createDate: string;
  updateDate: string;
  updateBy: string;
  isUsed?: boolean;
}

export type CategoryRef = DocumentReference<Category>;
export interface CategorySnap extends Category {
  category: Category[];
}

