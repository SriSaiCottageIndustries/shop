"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Plus, Minus, ChevronLeft, Heart, Share2, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useShop, Product } from "@/lib/shop-context"
import { toast } from "sonner"
import { LoadingAnimation } from "@/components/ui/loading-animation"



export default function ProductPage() {
    const params = useParams()
    const router = useRouter()
    const { addItem } = useCart()
    const { products } = useShop()
    const [product, setProduct] = useState<Product | undefined>(undefined)
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [activeImage, setActiveImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    // Changed to store array of strings for multi-select
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string[]>>({})
    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        if (params.id && products.length > 0) {
            const found = products.find(p => p.id === params.id)
            if (found) {
                setProduct(found)
                const related = products.filter(p => p.category === found.category && p.id !== found.id).slice(0, 3)
                setRelatedProducts(related)

                // Auto-select first option for each variant
                const defaults: Record<string, string[]> = {}
                if (found.variants) {
                    found.variants.forEach(v => {
                        if (v.options.length > 0) {
                            const firstOpt = v.options[0]
                            const label = typeof firstOpt === 'string' ? firstOpt : firstOpt.label
                            defaults[v.type] = [label]
                        }
                    })
                }
                setSelectedVariants(defaults)
                setQuantity(1)
            }
        }
    }, [params.id, products])

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFF8DC]">
            <LoadingAnimation />
        </div>
    )

    // Helper to extract label from option
    const getOptionLabel = (opt: string | { label: string }) => {
        return typeof opt === 'string' ? opt : opt.label
    }

    // Helper to get price from option if exists
    const getOptionPrice = (opt: string | { label: string, price?: string }) => {
        return typeof opt === 'object' && opt.price ? opt.price : null
    }

    // Single select variant handler
    const handleSelectVariant = (type: string, option: string | { label: string }) => {
        const label = getOptionLabel(option)
        setSelectedVariants(prev => ({
            ...prev,
            [type]: [label] // Replace existing selection (Single Select)
        }))
    }

    // Calculate current price based on selection
    const calculatePrice = () => {
        let activePrice = parseFloat(product.price)
        let activeOriginalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null

        if (product.variants) {
            Object.entries(selectedVariants).forEach(([type, selectedLabels]) => {
                const variantType = product.variants?.find(v => v.type === type)
                if (variantType) {
                    selectedLabels.forEach(label => {
                        const option = variantType.options.find(o => getOptionLabel(o) === label)
                        if (option) {
                            const priceStr = getOptionPrice(option)
                            if (priceStr) {
                                // Use specific price if set, overriding base or previous
                                activePrice = parseFloat(priceStr)
                            }

                            // Check for specific Original Price (MRP)
                            if (typeof option === 'object' && 'originalPrice' in option && option.originalPrice) {
                                activeOriginalPrice = parseFloat(option.originalPrice as string)
                            }
                        }
                    })
                }
            })
        }
        return { price: activePrice, originalPrice: activeOriginalPrice }
    }

    const { price: currentPrice, originalPrice: currentOriginalPrice } = calculatePrice()

    // Helper to generate all combinations of selected variants
    const generateCombinations = (variants: Record<string, string[]>): Record<string, string>[] => {
        const keys = Object.keys(variants)
        if (keys.length === 0) return []

        // If any key has empty selection, return empty (incomplete selection)
        if (keys.some(k => !variants[k] || variants[k].length === 0)) return []

        const [firstKey, ...restKeys] = keys
        const firstOptions = variants[firstKey]

        let combinations: Record<string, string>[] = firstOptions.map(opt => ({ [firstKey]: opt }))

        for (const key of restKeys) {
            const temp: Record<string, string>[] = []
            for (const combo of combinations) {
                for (const opt of variants[key]) {
                    temp.push({ ...combo, [key]: opt })
                }
            }
            combinations = temp
        }
        return combinations
    }

    const combinations = product.variants ? generateCombinations(selectedVariants) : []
    const totalQuantityToAdd = product.variants ? combinations.length * quantity : quantity

    const handleAddToCart = () => {
        // Validate variants
        if (product.variants && product.variants.length > 0) {
            const missing = product.variants.some((v) => !selectedVariants[v.type] || selectedVariants[v.type].length === 0)
            if (missing) {
                toast.error("Please select at least one option for each type")
                return
            }
        }

        if (product.variants && product.variants.length > 0) {
            // Add each combination
            combinations.forEach(combo => {
                // Calculate specific price for this combo
                let comboPrice = product.price

                // Find price in this specific combination
                Object.entries(combo).forEach(([type, label]) => {
                    const variantType = product.variants?.find(v => v.type === type)
                    if (variantType) {
                        const option = variantType.options.find(o => getOptionLabel(o) === label)
                        if (option) {
                            const pStr = getOptionPrice(option)
                            if (pStr) {
                                comboPrice = pStr
                            }
                        }
                    }
                })

                for (let i = 0; i < quantity; i++) {
                    addItem({
                        id: product.id,
                        name: product.name,
                        price: comboPrice,
                        image: product.images[0],
                        selectedVariants: combo
                    })
                }
            })
        } else {
            // Simple product (no variants)
            for (let i = 0; i < quantity; i++) {
                addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0]
                })
            }
        }

        toast.success(`Added ${totalQuantityToAdd} items to cart`)
    }

    const handleLike = () => {
        setIsLiked(!isLiked)
        toast.success(isLiked ? "Removed from wishlist" : "Added to wishlist")
    }

    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: `Check out ${product.name} on Sri Sai Cottage Industries!`,
            url: window.location.href,
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard!")
            }
        } catch (err) {
            console.error("Error sharing:", err)
        }
    }

    return (
        <div className="min-h-screen bg-[#FFF8DC]">
            <Header />
            <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">

                {/* Breadcrumb / Back */}
                <button onClick={() => router.back()} className="flex items-center text-[#8B4513] mb-8 hover:underline">
                    <ChevronLeft size={20} /> Back to Products
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border border-[#D7CCC8]"
                        >
                            <Image
                                src={product.images && product.images.length > 0 && product.images[activeImage] ? product.images[activeImage] : "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                            {product.badge && (
                                <span
                                    className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md"
                                    style={{ backgroundColor: product.badgeColor || "#8B4513" }}
                                >
                                    {product.badge}
                                </span>
                            )}
                        </motion.div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#8B4513] ring-2 ring-[#8B4513]/20' : 'border-transparent hover:border-[#D7CCC8]'}`}
                                >
                                    <Image src={img || "/placeholder.svg"} alt={`${product.name} ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#2C1810] mb-2">{product.name}</h1>
                        {product.tagline && <p className="text-xl text-[#8B4513] italic mb-6">{product.tagline}</p>}

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-3xl font-bold text-[#FF9933]">₹{currentPrice}</span>
                            {currentOriginalPrice && (
                                <span className="text-xl text-gray-400 line-through">₹{currentOriginalPrice}</span>
                            )}
                            {currentOriginalPrice && (
                                <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                                    {Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}% OFF
                                </span>
                            )}
                        </div>

                        {/* Variant Selection */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="space-y-4 mb-8 bg-[#FFF8F0] p-4 rounded-xl border border-[#D7CCC8]/50">
                                {product.variants.map((v, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-sm font-bold text-[#6D4C41] mb-2 uppercase tracking-wide flex justify-between">
                                            {v.type}
                                            {/* Removed "Select multiple" text as it's now single select-ish */}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {v.options.map((opt) => {
                                                const label = getOptionLabel(opt)
                                                // const price = getOptionPrice(opt) // Price used in main display now
                                                const isSelected = selectedVariants[v.type]?.includes(label)
                                                return (
                                                    <button
                                                        key={label}
                                                        onClick={() => handleSelectVariant(v.type, opt)}
                                                        className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${isSelected
                                                            ? "border-[#FF9933] bg-[#FF9933] text-white shadow-md relative pl-8"
                                                            : "border-[#D7CCC8] bg-white text-[#6D4C41] hover:border-[#FF9933] hover:text-[#FF9933]"
                                                            }`}
                                                    >
                                                        {isSelected && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white">✓</span>}
                                                        {label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                                {/* Validation Error Message */}
                                {product.variants.some((v) => !selectedVariants[v.type] || selectedVariants[v.type].length === 0) && (
                                    <p className="text-xs text-[#8B4513] flex items-center gap-1">
                                        <span className="inline-block w-1 h-1 rounded-full bg-[#FF9933]"></span>
                                        Please select at least one option for each type
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="text-[#6D4C41] text-lg leading-relaxed mb-8 whitespace-pre-line">
                            {product.description}
                        </div>

                        {/* Actions */}
                        <div className="mt-auto space-y-4">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="flex items-center bg-white rounded-full border border-[#D7CCC8] px-4 py-2">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-[#8B4513]"><Minus size={20} /></button>
                                    <span className="w-12 text-center font-bold text-[#2C1810] text-lg">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-[#8B4513]"><Plus size={20} /></button>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleLike}
                                        className={`p-3 rounded-full border border-[#D7CCC8] bg-white hover:bg-[#FFF8F0] transition-colors ${isLiked ? 'text-red-500' : 'text-[#6D4C41]'}`}
                                    >
                                        <Heart size={24} className={isLiked ? "fill-current" : ""} />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-3 rounded-full border border-[#D7CCC8] bg-white text-[#6D4C41] hover:bg-[#FFF8F0]"
                                    >
                                        <Share2 size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Summary Text on Button Context */}
                            {product.variants && combinations.length > 0 && (
                                <p className="text-sm font-bold text-[#8B4513] text-center">
                                    {combinations.length} types selected x {quantity} qty = {totalQuantityToAdd} items total
                                </p>
                            )}

                            <button
                                onClick={handleAddToCart}
                                disabled={product.variants && product.variants.some((v) => !selectedVariants[v.type] || selectedVariants[v.type].length === 0)}
                                className="w-full bg-[#FF9933] text-white py-4 rounded-full font-bold text-xl hover:bg-[#DAA520] transition-transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart size={24} />
                                {product.variants && product.variants.some((v) => !selectedVariants[v.type] || selectedVariants[v.type].length === 0)
                                    ? "Select Options"
                                    : `Add ${totalQuantityToAdd > 1 ? totalQuantityToAdd + " Items" : "to Cart"}`
                                }
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {
                    relatedProducts.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-[#D7CCC8]/30">
                            <h2 className="text-3xl font-bold text-[#2C1810] mb-8">Related Products</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedProducts.map(p => (
                                    <motion.div
                                        key={p.id}
                                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer group"
                                        onClick={() => router.push(`/product/${p.id}`)}
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="relative aspect-[4/5] bg-gray-100">
                                            <Image
                                                src={p.images && p.images.length > 0 && p.images[0] ? p.images[0] : "/placeholder.svg"}
                                                alt={p.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-[#2C1810] mb-1 group-hover:text-[#FF9933] transition-colors">{p.name}</h3>
                                            <p className="text-[#8B4513]">₹{typeof p.price === 'string' ? p.price : 'Var'}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )
                }

            </main >
            <Footer />
        </div >
    )
}
