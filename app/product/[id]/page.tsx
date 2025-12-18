"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Plus, Minus, ChevronLeft, Heart, Share2, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useShop } from "@/lib/shop-context"
import { Product } from "@/lib/data"
import { toast } from "sonner"



export default function ProductPage() {
    const params = useParams()
    const router = useRouter()
    const { addItem } = useCart()
    const { products } = useShop()
    const [product, setProduct] = useState<Product | undefined>(undefined)
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [activeImage, setActiveImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        if (params.id && products.length > 0) {
            const found = products.find(p => p.id === params.id)
            if (found) {
                setProduct(found)
                const related = products.filter(p => p.category === found.category && p.id !== found.id).slice(0, 3)
                setRelatedProducts(related)
            }
        }
    }, [params.id, products])

    if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#FFF8DC]">Loading...</div>

    const handleAddToCart = () => {
        // Add item multiple times based on quantity
        // Since our context doesn't support 'add quantity' directly yet in one call properly without looping or updating context
        // We will just call addItem once for now, or loop. The user complained count isn't showing.
        // Let's loop for now to be safe with current context implementation
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0]
            })
        }
        toast.success(`Added ${quantity} ${product.name} to cart`)
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
                                <span className="absolute top-4 left-4 bg-[#8B4513] text-white px-3 py-1 rounded-full text-sm font-medium">
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
                            <span className="text-3xl font-bold text-[#FF9933]">₹{product.price}</span>
                            {product.originalPrice && (
                                <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                            )}
                            {product.originalPrice && (
                                <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                                    {Math.round(((parseInt(product.originalPrice) - parseInt(product.price)) / parseInt(product.originalPrice)) * 100)}% OFF
                                </span>
                            )}
                        </div>

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
                                    <button className="p-3 rounded-full border border-[#D7CCC8] bg-white text-[#6D4C41] hover:bg-[#FFF8F0]"><Heart size={24} /></button>
                                    <button className="p-3 rounded-full border border-[#D7CCC8] bg-white text-[#6D4C41] hover:bg-[#FFF8F0]"><Share2 size={24} /></button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-[#FF9933] text-white py-4 rounded-full font-bold text-xl hover:bg-[#DAA520] transition-transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-3"
                            >
                                <ShoppingCart size={24} /> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
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
                                        <p className="text-[#8B4513]">₹{p.price}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    )
}
