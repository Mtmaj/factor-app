// @/types/factors.ts
export interface Factor {
  id: string
  customer_id: string
  customer_name?: string          
  date: string
  type_doc: string
  from?: string
  weight: string
  weight_with_plastic: string
  quote: number
  created_date: string
  is_deleted: boolean
  document_id: string
  serial_number: string
  products: { serial_number: string; weight: string; weight_with_plastic: string }[]
}

export interface Customer {
  id: string
  full_name: string
  phone_number: string
  address?: string
  telephone?: string
  card_id?: string
  city?: string
  created_date: string
  is_deleted: boolean
}
