"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

export type CartItem = {
    id: string
    name: string
    price: string
    image: string
    quantity: number
}

type CartContextType = {
    items: CartItem[]
    addItem: (item: Omit<CartItem, "quantity">) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error("Failed to parse cart", e)
            }
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items))
    }, [items])

    const addItem = (item: Omit<CartItem, "quantity">) => {
        console.log("Adding item to cart:", item)
        if (!item || !item.id) {
            console.error("Invalid item:", item)
            return
        }

        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id)
            if (existing) {
                console.log("Updating quantity for existing item")
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                )
            }
            console.log("Adding new item")
            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        setItems((prev) => prev.map((item) => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(0, quantity) }
            }
            return item
        }))
    }

    const clearCart = () => {
        setItems([])
        localStorage.removeItem("cart")
    }

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

    const cartTotal = items.reduce((acc, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ""))
        return acc + price * item.quantity
    }, 0)

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
