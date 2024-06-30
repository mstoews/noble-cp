import { FieldValue } from "firebase/firestore";
import { Product } from '../products'

export interface IImageMaintenance {
  id:               number;
  title:            string;
  sub_title:        string;
  image_url:        string;
  applied:          boolean;
  user_updated:     string | null | undefined;
  date_created:     FieldValue;
  date_updated:     FieldValue;
}

export interface Collection {
  id:               number;
  title:            string;
  color:            string;
  price:            string;
  sub_title:        string;
  image_url:        string;
  applied:          boolean;
  inventory:        Product[];
  user_updated:     string | null | undefined;
  date_created:     string;
  date_updated:     string;
}


export interface IImageStorage {
  name: string;
  parentId: string;
  url: string | null;
  version_no: number;
}


