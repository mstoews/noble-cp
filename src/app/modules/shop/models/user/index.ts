export interface User
{
  id: string;
  uuid: string;
  email: string;
  phone_number: string;
  work_number: string;
  moble_number: string;
  first_name: string;
  last_name: string;
  billing_shipping_address_same: boolean;
  billing_address_street: string;
  billing_address_building?: string;
  billing_address_prov_state: string;
  billing_address_country: string;
  billing_address_postal_code: string;
  shipping_address_street: string;
  shipping_address_building?: string;
  shipping_address_prov_state: string;
  shipping_address_country: string;
  shipping_address_postal_code: string;
}
