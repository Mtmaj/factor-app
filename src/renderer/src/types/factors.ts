export interface Factor {
  customer_id: string;
  id: string;
  date: string;
  type_doc: string;
  from?: string;
  weight: string;
  weight_with_plastic: string;
  quote: number;
  created_date: string;
  is_deleted: boolean;
  document_id:string;
}

export interface Customer {
  address?: string;
  telephone?: string;
  phone_number: string;
  card_id?: string;
  id: string;
  full_name: string;
  city?: string;
  created_date: string;
  is_deleted: boolean;
}
