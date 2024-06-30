import { FieldValue } from "firebase/firestore";
export interface WishList {
  id:   string;
  product_id: string;
  description:   string;
  rich_description: string;
  image:        string;
  brand:        string;
  price:        number;
  category:     string;
  rating:       string;
  quantity: number;
  is_featured:  string;
  user_updated: string;
  date_created: string;
  date_updated: string;
}
