import { z } from 'zod'

export const checkoutSchema = z.object({
  full_name: z.string().min(2, 'Name required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit number required'),
  address_line1: z.string().min(5, 'Address required'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  pincode: z.string().regex(/^\d{6}$/, 'Valid 6-digit pincode required'),
  notes: z.string().optional(),
})
export type CheckoutFormData = z.infer<typeof checkoutSchema>

export const productSchema = z.object({
  name: z.string().min(2, 'Name required'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Must be positive'),
  stock: z.coerce.number().int().min(0),
  category: z.string().min(1, 'Category required'),
  carat: z.coerce.number().optional(),
  cut: z.string().optional(),
  color: z.string().optional(),
  clarity: z.string().optional(),
  origin: z.string().optional(),
  certification: z.string().optional(),
  is_featured: z.boolean().default(false),
})
export type ProductFormData = z.infer<typeof productSchema>

export const ticketSchema = z.object({
  subject: z.string().min(5, 'Subject too short'),
  message: z.string().min(10, 'Message too short'),
  order_id: z.string().uuid().optional(),
})
export type TicketFormData = z.infer<typeof ticketSchema>