export interface ProfileModel {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  address_line1: string;
  address_line2: string;
  city: string;
  province_state: string;
  postal_code: string;
  phone_number: string;
  created_date?: string;
  country: string;
  userId?: string;
}
