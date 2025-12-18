"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

export type CartItem = {
    id: string
    name: string
    price: string
    image: string
    quantity: number
    selectedVariants?: Record<string, string>
}

type CartContextType = {
    items: CartItem[]
    addItem: (item: Omit<CartItem, "quantity">) => void
    removeItem: (id: string, selectedVariants?: Record<string, string>) => void
    updateQuantity: (id: string, quantity: number, selectedVariants?: Record<string, string>) => void
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

    // Helper to compare variants irrespective of key order
    const areVariantsEqual = (v1?: Record<string, string>, v2?: Record<string, string>) => {
        if (!v1 && !v2) return true
        if (!v1 || !v2) return false
        const keys1 = Object.keys(v1).sort()
        const keys2 = Object.keys(v2).sort()
        if (keys1.length !== keys2.length) return false
        if (!keys1.every((k, i) => k === keys2[i])) return false
        return keys1.every(k => v1[k] === v2[k])
    }

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
            // Check for existing item with SAME ID and SAME VARIANTS
            const existingIndex = prev.findIndex((i) => {
                const sameId = i.id === item.id;
                return sameId && areVariantsEqual(i.selectedVariants, item.selectedVariants);
            })

            if (existingIndex > -1) {
                console.log("Updating quantity for existing item")
                const newItems = [...prev]
                newItems[existingIndex].quantity += 1
                return newItems
            }
            console.log("Adding new item")
            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const removeItem = (id: string, selectedVariants?: Record<string, string>) => {
        setItems((prev) => prev.filter((i) => {
            // Keep item if ID is different OR Variants are different
            const sameId = i.id === id;
            const sameVariants = areVariantsEqual(i.selectedVariants, selectedVariants);
            return !(sameId && sameVariants);
        }))
    }

    const updateQuantity = (id: string, quantity: number, selectedVariants?: Record<string, string>) => {
        setItems((prev) => prev.map((item) => {
            const sameId = item.id === id;
            const sameVariants = areVariantsEqual(item.selectedVariants, selectedVariants);

            if (sameId && sameVariants) {
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
        const priceStr = item.price ? String(item.price) : "0"
        const price = parseFloat(priceStr.replace(/[^0-9.]/g, ""))
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
