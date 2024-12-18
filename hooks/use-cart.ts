'use client';

import { create } from 'zustand';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

// Define the Cart Item Type
interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

// Define the Cart Interface
interface Cart {
  items: CartItem[];
}


interface CartStore {
  itemCount: number;
  setItemCount: (count: number) => void;
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
}

const useCartStore = create<CartStore>((set) => ({
  itemCount: 0,
  setItemCount: (count) => set({ itemCount: count }),
  cart: null,
  setCart: (cart) => set({ cart }),
}));

export function useCart() {
  const { data: session } = useSession();
  const { itemCount, setItemCount, cart, setCart } = useCartStore();

  useEffect(() => {
      if(session?.user) {
          fetchCart()
      } else {
          setItemCount(0);
          setCart(null);
      }
  }, [session, setItemCount, setCart]);

  const fetchCart = async () => {
    try {
        const response = await fetch('/api/cart');
      if (!response.ok) {
          throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
      }
      const cartData = await response.json();
       setCart(cartData);
       setItemCount(cartData.items?.length || 0);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
        setCart(null);
        setItemCount(0);
    }
  };

    const updateCart = async (itemId: string, quantity: number) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId, quantity }),
            });

           if (!response.ok) {
                throw new Error(`Failed to update cart: ${response.status} ${response.statusText}`);
            }
        
          fetchCart(); // Fetch data after every update.
        } catch(error) {
            console.error('Failed to update cart:', error)
        }
    }



  return {
    itemCount,
    cart,
    refreshCart: fetchCart,
    updateCart,
  };
}