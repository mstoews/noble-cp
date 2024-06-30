import { FieldValue } from "firebase/firestore";
import { imageItem } from '../imageItem'


export interface ProductPartial {
  id: string;
  description:   string;
  rich_description: string;
  category:     string;
  date_created: string;
}
