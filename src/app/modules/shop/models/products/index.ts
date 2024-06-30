
export interface Product {
  id:   string;
  description:   string;
  category:     string;
  rich_description: string;
  date_created: string;
  short_description?: string;
  product_id?: string;
  image?:     string;
  image200?:  string;
  brand?:        string;
  price?:        number;
  comments?:       string;
  is_featured?:  string;
  user_updated?: string;
  date_updated?: string;
  status?: string;
  purchases_allowed?: boolean;
  quantity_required?: boolean;
  is_active?: boolean;
  quantity?: number;
  quantity_increment?: number;
  is_completed?: boolean;
  is_clothing?: boolean;
  is_tailoring?: boolean;
  is_coats_tops?: boolean;
  is_trousers?: boolean;
  user_purchased?: string;
  date_sold?: string;
  waist?: number;
  bust?: number;
  height?: number;
  inseam?: number;
  outseam?: number;
  sleeve_length?: number;
  hip?: number;
}

