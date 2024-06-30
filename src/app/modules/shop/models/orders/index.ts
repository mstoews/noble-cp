import { Product } from '../products'
export interface Orders {
    id:               number;
    user_id:          string;
    is_filled:        boolean;
    is_delivery_confirmed: boolean;
    user_updated:     string;
    date_created:     string;
    date_updated:     string;
    products:         Product[];
}
