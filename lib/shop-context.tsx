"use client"

import { createContext, useContext, useState, useEffect } from "react"
// import { Product } from "./data" // Removed to avoid conflict
import { supabase } from "./supabaseClient"
import { toast } from "sonner"

export interface Product {
    id: string
    name: string
    price: string
    originalPrice?: string
    images: string[]
    badge?: string
    materials?: string[]
    tagline?: string
    description?: string
    category: string
    variants?: { type: string, options: string[] }[]
    swatches?: { name: string; color: string }[]
}

export interface Category {
    id: string
    name: string
    image: string
}

interface ShopContextType {
    products: Product[]
    categories: Category[]
    addProduct: (product: Product) => Promise<void>
    updateProduct: (id: string, product: Product) => Promise<void>
    deleteProduct: (id: string) => Promise<void>
    addCategory: (category: Category) => Promise<void>
    updateCategory: (id: string, category: Category) => Promise<void>
    deleteCategory: (id: string) => Promise<void>
    refreshData: () => Promise<void>
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

export function ShopProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    const fetchData = async () => {
        try {
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })

            const { data: categoriesData, error: categoriesError } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: false })

            if (productsError) throw productsError
            if (categoriesError) throw categoriesError

            const formattedCategories: Category[] = (categoriesData || []).map((c: any) => ({
                id: c.id.toString(),
                name: c.name,
                image: c.image
            }))

            setCategories(formattedCategories)

            // Map DB fields if necessary (DB uses snake_case usually, but we define types)
            // Assuming DB columns match or we map them. 
            // In schema.sql provided: original_price (snake), category_id
            // In frontend: originalPrice (camel), category string

            const formattedProducts: Product[] = (productsData || []).map((p: any) => {
                // Find category name from ID
                const cat = formattedCategories.find(c => c.id === p.category_id?.toString())
                return {
                    id: p.id.toString(),
                    name: p.name,
                    price: p.price.toString(),
                    originalPrice: p.original_price?.toString(),
                    images: p.images || [],
                    badge: p.badge,
                    materials: p.materials || [],
                    tagline: p.tagline,
                    description: p.description,
                    category: cat ? cat.name : (p.category || ""), // Use name from ID, or fallback
                    variants: p.variants || [],
                    swatches: [] // Not in DB schema yet, default empty
                }
            })

            setProducts(formattedProducts)
            setIsLoaded(true)
        } catch (error) {
            console.error("Error fetching data:", error)
            // toast.error("Failed to load shop data")
        }
    }

    useEffect(() => {
        fetchData()

        // Optional: Realtime subscription could go here
    }, [])

    const addProduct = async (product: Product) => {
        try {
            // Optimistic update
            setProducts(prev => [product, ...prev])

            // Find category ID
            const cat = categories.find(c => c.name === product.category)
            const categoryId = cat ? parseInt(cat.id) : null

            const { error } = await supabase.from('products').insert({
                name: product.name,
                price: parseFloat(product.price),
                original_price: product.originalPrice ? parseFloat(product.originalPrice) : null,
                images: product.images,
                badge: product.badge,
                materials: product.materials,
                tagline: product.tagline,
                description: product.description,
                category_id: categoryId, // Send ID, not name
                variants: product.variants
            })

            if (error) throw error
            toast.success("Product added to database")
            fetchData() // Refresh to get real ID
        } catch (e: any) {
            console.error(e)
            toast.error("Failed to save product: " + e.message)
            fetchData() // Revert
        }
    }

    const updateProduct = async (id: string, updatedProduct: Product) => {
        try {
            setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p))

            // Find category ID
            const cat = categories.find(c => c.name === updatedProduct.category)
            const categoryId = cat ? parseInt(cat.id) : null

            const { error } = await supabase.from('products').update({
                name: updatedProduct.name,
                price: parseFloat(updatedProduct.price),
                original_price: updatedProduct.originalPrice ? parseFloat(updatedProduct.originalPrice) : null,
                images: updatedProduct.images,
                badge: updatedProduct.badge,
                materials: updatedProduct.materials,
                tagline: updatedProduct.tagline,
                description: updatedProduct.description,
                category_id: categoryId,
                variants: updatedProduct.variants
            }).eq('id', id)

            if (error) throw error
            toast.success("Product updated")
        } catch (e: any) {
            toast.error("Failed to update: " + e.message)
            fetchData()
        }
    }

    const deleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return
        try {
            setProducts(prev => prev.filter(p => p.id !== id))
            const { error } = await supabase.from('products').delete().eq('id', id)
            if (error) throw error
            toast.success("Product deleted")
        } catch (e: any) {
            toast.error("Failed to delete: " + e.message)
            fetchData()
        }
    }

    const addCategory = async (category: Category) => {
        try {
            setCategories(prev => [...prev, category])
            const { error } = await supabase.from('categories').insert({
                name: category.name,
                image: category.image
            })
            if (error) throw error
            toast.success("Category added")
            fetchData()
        } catch (e: any) {
            toast.error("Failed to add category: " + e.message)
            fetchData()
        }
    }

    const updateCategory = async (id: string, updatedCategory: Category) => {
        try {
            setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c))
            const { error } = await supabase.from('categories').update({
                name: updatedCategory.name,
                image: updatedCategory.image
            }).eq('id', id)
            if (error) throw error
            toast.success("Category updated")
        } catch (e: any) {
            toast.error("Failed to update category: " + e.message)
            fetchData()
        }
    }

    const deleteCategory = async (id: string) => {
        if (!confirm("Are you sure?")) return
        try {
            setCategories(prev => prev.filter(c => c.id !== id))
            const { error } = await supabase.from('categories').delete().eq('id', id)
            if (error) throw error
            toast.success("Category deleted")
        } catch (e: any) {
            toast.error("Failed to delete category: " + e.message)
            fetchData()
        }
    }

    return (
        <ShopContext.Provider value={{
            products,
            categories,
            addProduct,
            updateProduct,
            deleteProduct,
            addCategory,
            updateCategory,
            deleteCategory,
            refreshData: fetchData
        }}>
            {children}
        </ShopContext.Provider>
    )
}

export function useShop() {
    const context = useContext(ShopContext)
    if (context === undefined) {
        throw new Error("useShop must be used within a ShopProvider")
    }
    return context
}
