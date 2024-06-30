import { Product } from '../products';

export interface Collection {
  id: string;
  title: string;
  short_description?: string;
  body: string;
  user_updated: string;
  date_created: string;
  date_updated: string;
  image: string;
  published: boolean;
}

export interface CollectionsPartial {
  id: string;
  title: string;
  date_created: string;
  published: boolean;
}

export interface CollectionsComments {
  id: string;
  col_id: string;
  name: string;
  message: string;
  created_date: string;
  reply: string;
  reply_date: string;
}
