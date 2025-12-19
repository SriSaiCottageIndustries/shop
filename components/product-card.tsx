"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: string
    image: string
    badge?: string
    badgeColor?: string
    materials: string[]
    swatches: { name: string; color: string }[]
    quickLookImages: string[]
    dimensions: string
  }
  onQuickLook: (product: any) => void
}

export function ProductCard({ product }: { product: any }) {
  const router = useRouter()

  return (
    <motion.div
      className="group relative bg-white overflow-hidden cursor-pointer rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
      layout
      onClick={() => router.push(`/product/${product.id}`)}
      whileHover={{ y: -5 }}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-20">
          <span
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md shadow-sm ring-1 ring-white/20 text-white",
              !product.badgeColor && product.badge === "New" && "bg-emerald-500/90",
              !product.badgeColor && product.badge === "Back in stock" && "bg-blue-500/90",
              !product.badgeColor && product.badge === "Limited" && "bg-amber-500/90",
              !product.badgeColor && product.badge === "Bestseller" && "bg-purple-500/90",
              !product.badgeColor && product.badge === "Popular" && "bg-rose-500/90",
              !product.badgeColor && product.badge === "Premium" && "bg-slate-800/90",
              !product.badgeColor && product.badge === "Traditional" && "bg-orange-500/90",
              !product.badgeColor && !["New", "Back in stock", "Limited", "Bestseller", "Popular", "Premium", "Traditional"].includes(product.badge) && "bg-gray-800/90"
            )}
            style={product.badgeColor ? { backgroundColor: product.badgeColor } : undefined}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src={product.images && product.images.length > 0 && product.images[0] ? product.images[0] : "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
      </div>

      {/* Product Info Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-md">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            {/* Price */}
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white drop-shadow-md">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-white/70 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* View Icon */}
            <motion.button
              className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/30"
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
