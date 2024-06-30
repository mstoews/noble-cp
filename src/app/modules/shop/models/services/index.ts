import { FieldValue } from "firebase/firestore";
export interface Services {
  id:   string;
  description:   string;
  rich_description: string;
  image:     string;
  title:        string;
  ranking:    number;
  is_active:  boolean;
  user_updated: string;
  date_created: FieldValue;
  date_updated: FieldValue;
}
