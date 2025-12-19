"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Trash2, ShoppingCart, Printer, Save, X, Loader2 } from "lucide-react"
import { useShop } from "@/lib/shop-context"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

interface BillingViewProps {
    onBack: () => void
}

export function BillingView({ onBack }: BillingViewProps) {
    const { products, categories } = useShop()

    const [cart, setCart] = useState<any[]>([])

    // Selection State
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    // Customer State
    const [customer, setCustomer] = useState({
        name: "",
        mobile: "",
        address: "Store Walk-in"
    })

    const [loading, setLoading] = useState(false)

    const [selectedProductForVariant, setSelectedProductForVariant] = useState<any | null>(null)
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

    // Filter products by selected category
    const displayProducts = selectedCategory
        ? products.filter(p => p.category === selectedCategory)
        : []

    const handleProductClick = (product: any) => {
        if (product.variants && product.variants.length > 0) {
            setSelectedProductForVariant(product)
            const initialOptions: Record<string, string> = {}
            product.variants.forEach((v: any) => {
                if (v.options.length > 0) {
                    const opt = v.options[0]
                    initialOptions[v.type] = typeof opt === 'string' ? opt : opt.label
                }
            })
            setSelectedOptions(initialOptions)
        } else {
            addToCart(product)
        }
    }

    const addToCart = (product: any, variants?: Record<string, string>) => {
        let calculatedPrice = product.price
        if (variants && product.variants) {
            Object.entries(variants).forEach(([vType, vLabel]) => {
                const variant = product.variants.find((v: any) => v.type === vType)
                if (variant) {
                    const option = variant.options.find((o: any) => (typeof o === 'string' ? o : o.label) === vLabel)
                    if (option && typeof option !== 'string' && option.price) {
                        calculatedPrice = option.price
                    }
                }
            })
        }

        const variantKey = variants ? Object.values(variants).join("-") : ""
        const itemId = variants ? `${product.id}-${variantKey}` : product.id
        const existing = cart.find(item => item.cartId === itemId)

        if (existing) {
            setCart(cart.map(item => item.cartId === itemId ? { ...item, quantity: item.quantity + 1 } : item))
        } else {
            setCart([...cart, {
                ...product,
                cartId: itemId,
                selectedVariants: variants,
                quantity: 1,
                customPrice: calculatedPrice
            }])
        }
    }

    const confirmVariantSelection = () => {
        if (selectedProductForVariant) {
            addToCart(selectedProductForVariant, selectedOptions)
            setSelectedProductForVariant(null)
            setSelectedOptions({})
        }
    }

    const updateCartItem = (cartId: string, field: 'quantity' | 'customPrice', value: number) => {
        setCart(cart.map(item => {
            if (item.cartId === cartId) {
                return { ...item, [field]: value }
            }
            return item
        }))
    }

    const handleRemoveItem = (cartId: string) => {
        setCart(cart.filter(item => item.cartId !== cartId))
    }

    const totalAmount = cart.reduce((sum, item) => sum + (Number(item.customPrice || item.price) * item.quantity), 0)

    const handleCreateBill = async (print: boolean) => {
        if (cart.length === 0) {
            toast.error("Cart is empty")
            return
        }
        if (!customer.name) {
            toast.error("Enter customer name")
            return
        }

        setLoading(true)

        // Prepare items for DB
        const dbItems = cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: Number(item.customPrice || item.price),
            variants: item.selectedVariants
        }))

        const { error } = await supabase.from('orders').insert([
            {
                customer_name: customer.name,
                customer_mobile: "", // Removed as requested
                customer_address: "Store Walk-in",
                items: dbItems,
                total_amount: totalAmount,
                status: 'completed',
                source: 'pos'
            }
        ])

        if (error) {
            toast.error("Failed to save bill")
            console.error(error)
        } else {
            toast.success(print ? "Bill generated & printed!" : "Order saved!")
            if (print) {
                window.print()
            }
            // Clear or Keep? User said "Complete" might imply done.
            setCart([])
            setCustomer({ name: "", mobile: "", address: "Store Walk-in" })
            setSelectedCategory(null)
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4 shrink-0 print:hidden">
                <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-[#2C1810]" />
                </button>
                <h2 className="text-2xl font-bold text-[#2C1810]">POS System</h2>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 gap-6 h-auto min-h-screen lg:h-[calc(100vh-100px)] lg:overflow-hidden bg-gray-50 lg:bg-transparent">
                {/* Variant Selection Modal */}
                {selectedProductForVariant && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
                            <h3 className="text-xl font-bold mb-4">{selectedProductForVariant.name}</h3>
                            <div className="space-y-4 mb-6">
                                {selectedProductForVariant.variants.map((v: any, idx: number) => (
                                    <div key={idx}>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">{v.type}</label>
                                        <div className="flex flex-wrap gap-2">
                                            {v.options.map((opt: any) => {
                                                const label = typeof opt === 'string' ? opt : opt.label
                                                const price = typeof opt !== 'string' && opt.price ? opt.price : null
                                                const isSelected = selectedOptions[v.type] === label
                                                return (
                                                    <button
                                                        key={label}
                                                        onClick={() => setSelectedOptions(prev => ({ ...prev, [v.type]: label }))}
                                                        className={`px-3 py-1.5 rounded border text-sm flex flex-col items-center min-w-[60px] transition-colors ${isSelected ? 'bg-[#2C1810] text-white border-[#2C1810]' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                                    >
                                                        <span className="font-medium">{label}</span>
                                                        {price && (
                                                            <span className={`text-[10px] font-bold ${isSelected ? 'text-[#FF9933]' : 'text-green-600'}`}>
                                                                ₹{price}
                                                            </span>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={confirmVariantSelection} className="flex-1 bg-[#FF9933] text-white py-2 rounded font-bold">Add to Order</button>
                                <button onClick={() => setSelectedProductForVariant(null)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-bold">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* LEFT PANEL: Selection Area */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-[#EFEBE9] p-4 lg:overflow-y-auto print:hidden order-2 lg:order-1 h-fit lg:h-full">

                    {/* View: Product Selection (if category selected) */}
                    {selectedCategory ? (
                        <div>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="mb-4 flex items-center gap-2 text-[#8B4513] hover:underline font-medium"
                            >
                                <ArrowLeft size={16} /> Back to Categories
                            </button>
                            <h3 className="text-xl font-bold text-[#2C1810] mb-4">{selectedCategory}</h3>

                            {displayProducts.length === 0 ? (
                                <p className="text-gray-500 italic">No products in this category.</p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                                    {displayProducts.map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleProductClick(product)}
                                            className="border rounded-lg p-2 hover:shadow-md transition-shadow flex flex-col items-center text-center bg-gray-50 hover:bg-[#FFF8DC]"
                                        >
                                            <div className="w-full h-24 sm:h-32 bg-white rounded-md mb-2 overflow-hidden relative">
                                                <img
                                                    src={product.images && product.images[0] ? product.images[0] : "/placeholder.svg"}
                                                    className="w-full h-full object-cover"
                                                    alt={product.name}
                                                />
                                                {product.variants && product.variants.length > 0 && (
                                                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">Options</span>
                                                )}
                                            </div>
                                            <div className="w-full">
                                                <h4 className="font-bold text-sm text-[#2C1810] truncate">{product.name}</h4>
                                                <span className="text-[#FF9933] font-bold">₹{product.price}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* View: Category Selection */
                        <div>
                            <h3 className="text-lg font-bold text-[#2C1810] mb-4">Select Category</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className="border-2 border-transparent hover:border-[#FF9933] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all text-center bg-white group"
                                    >
                                        <div className="h-24 sm:h-32 w-full overflow-hidden">
                                            <img
                                                src={cat.image || "/placeholder.svg"}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                alt={cat.name}
                                            />
                                        </div>
                                        <div className="p-3 bg-gray-50 font-bold text-[#2C1810] text-sm sm:text-base">
                                            {cat.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL: Cart */}
                <div className="w-full lg:w-[400px] bg-white rounded-lg shadow-lg border border-[#EFEBE9] flex flex-col h-auto lg:h-full shrink-0 order-last mb-6 lg:mb-0">
                    <div className="p-4 border-b bg-[#2C1810] text-white rounded-t-lg">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <ShoppingCart size={20} /> Current Order
                        </h3>
                    </div>

                    <div className="flex-1 p-4 space-y-3 min-h-[200px] lg:overflow-y-auto">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
                                <ShoppingCart size={48} className="mb-2 opacity-20" />
                                <p>Cart is empty</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.cartId} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 relative group">
                                    <button
                                        onClick={() => handleRemoveItem(item.cartId)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity shadow-sm"
                                    >
                                        <X size={12} />
                                    </button>

                                    <div className="w-12 h-12 bg-white rounded overflow-hidden shrink-0 border">
                                        <img src={item.images && item.images[0] ? item.images[0] : "/placeholder.svg"} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-[#2C1810] line-clamp-1">{item.name}</h4>
                                        {item.selectedVariants && (
                                            <div className="text-xs text-gray-500 flex flex-wrap gap-1 mt-0.5">
                                                {Object.entries(item.selectedVariants).map(([k, v]) => (
                                                    <span key={k} className="bg-gray-200 px-1 rounded">{v as string}</span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex items-start gap-4 mt-2">
                                            <div>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Qty</span>
                                                <div className="flex items-center border rounded bg-white shadow-sm">
                                                    <button
                                                        onClick={() => updateCartItem(item.cartId, 'quantity', Math.max(1, item.quantity - 1))}
                                                        className="px-2 py-1 hover:bg-gray-100 text-gray-600 border-r transition-colors"
                                                    >-</button>
                                                    <span className="px-2 text-xs font-bold w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateCartItem(item.cartId, 'quantity', item.quantity + 1)}
                                                        className="px-2 py-1 hover:bg-gray-100 text-gray-600 border-l transition-colors"
                                                    >+</button>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Price</span>
                                                <div className="flex items-center border rounded bg-white px-2 py-1 shadow-sm">
                                                    <span className="text-gray-400 text-xs mr-1">₹</span>
                                                    <input
                                                        type="number"
                                                        className="w-16 outline-none bg-transparent text-[#2C1810] font-bold text-sm"
                                                        value={item.customPrice || item.price}
                                                        onChange={(e) => updateCartItem(item.cartId, 'customPrice', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right font-bold text-[#FF9933]">
                                        ₹{(Number(item.customPrice || item.price) * item.quantity).toFixed(0)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 bg-gray-50 border-t space-y-4">
                        <div className="space-y-2">
                            <input
                                value={customer.name}
                                onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                className="w-full p-2 border rounded text-sm"
                                placeholder="Customer Name *"
                            />
                        </div>

                        <div className="flex justify-between items-center text-lg font-bold text-[#2C1810] pt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span>₹{totalAmount.toFixed(0)}</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleCreateBill(true)}
                                disabled={loading || cart.length === 0}
                                className="flex-1 bg-[#2C1810] text-white py-3 rounded-lg font-bold hover:bg-[#4E342E] disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg text-sm"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Printer size={16} />}
                                Generate Bill
                            </button>
                            <button
                                onClick={() => handleCreateBill(false)}
                                disabled={loading || cart.length === 0}
                                className="flex-1 bg-[#FF9933] text-white py-3 rounded-lg font-bold hover:bg-[#ff8800] disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg text-sm"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Complete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
