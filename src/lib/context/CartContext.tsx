'use client'
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string; product_id: string; name: string; price: number
  image_url: string; quantity: number; stock: number
}

interface CartState { items: CartItem[]; total: number; count: number }
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  let items: CartItem[]
  switch (action.type) {
    case 'LOAD_CART': items = action.payload; break
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.product_id === action.payload.product_id)
      items = existing
        ? state.items.map((i) => i.product_id === action.payload.product_id ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) } : i)
        : [...state.items, { ...action.payload, quantity: 1 }]
      break
    }
    case 'REMOVE_ITEM': items = state.items.filter((i) => i.product_id !== action.payload); break
    case 'UPDATE_QTY': items = state.items.map((i) => i.product_id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i).filter((i) => i.quantity > 0); break
    case 'CLEAR_CART': items = []; break
    default: return state
  }
  return { items, total: items.reduce((s, i) => s + i.price * i.quantity, 0), count: items.reduce((s, i) => s + i.quantity, 0) }
}

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void; removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void; clearCart: () => void
}

const CartContext = createContext<CartContextType>({ items: [], total: 0, count: 0, addItem: () => {}, removeItem: () => {}, updateQty: () => {}, clearCart: () => {} })

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, count: 0 })
  useEffect(() => {
    try { const stored = localStorage.getItem('divaura_cart'); if (stored) dispatch({ type: 'LOAD_CART', payload: JSON.parse(stored) }) } catch {}
  }, [])
  useEffect(() => { localStorage.setItem('divaura_cart', JSON.stringify(state.items)) }, [state.items])
  return (
    <CartContext.Provider value={{ ...state, addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }), removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }), updateQty: (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, quantity: qty } }), clearCart: () => dispatch({ type: 'CLEAR_CART' }) }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)