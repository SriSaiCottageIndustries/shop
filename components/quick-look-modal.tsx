"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { BlurPanel } from "./blur-panel"

interface QuickLookModalProps {
  product: any
  isOpen: boolean
  onClose: () => void
}

export function QuickLookModal({ product, isOpen, onClose }: QuickLookModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSwatch, setSelectedSwatch] = useState(0)

  useEffect(() => {
    if (isOpen && product) {
      setCurrentImageIndex(0)
      setSelectedSwatch(0)
    }
  }, [isOpen, product])

  if (!product) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.quickLookImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.quickLookImages.length) % product.quickLookImages.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#2C1810]/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <BlurPanel className="bg-[#FFF8DC]/98 backdrop-blur-md">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Image Gallery */}
                <div className="relative">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-[#EFEBE9]">
                    <Image
                      src={product.quickLookImages[currentImageIndex] || "/placeholder.svg"}
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Navigation Arrows */}
                    {product.quickLookImages.length > 1 && (
                      <>
                        <button
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#FFF8DC]/90 backdrop-blur-sm p-2 rounded-full hover:bg-[#FFF8DC] transition-all duration-200 text-[#8B4513]"
                          onClick={prevImage}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#FFF8DC]/90 backdrop-blur-sm p-2 rounded-full hover:bg-[#FFF8DC] transition-all duration-200 text-[#8B4513]"
                          onClick={nextImage}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Image Thumbnails */}
                  <div className="flex gap-2">
                    {product.quickLookImages.map((image: string, index: number) => (
                      <button
                        key={index}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index ? "border-[#8B4513]" : "border-[#D7CCC8]"
                          }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                {/* Product Details */}
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4 lg:mb-6">
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-[#2C1810] mb-2 leading-tight pr-8">{product.name}</h2>
                      {product.badge && <span className="inline-block px-2 py-1 bg-[#8B4513] text-white text-xs rounded-full mb-2">{product.badge}</span>}
                      <p className="text-base lg:text-lg text-[#6D4C41] font-medium">{product.materials.join(", ")}</p>
                    </div>
                    <button
                      className="p-2 hover:bg-[#EFEBE9] rounded-full transition-colors duration-200 text-[#8B4513]"
                      onClick={onClose}
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] pr-2">
                    {/* Price */}
                    <div className="text-3xl font-bold text-[#8B4513]">{product.price}</div>

                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-semibold text-[#2C1810] mb-3 tracking-wider uppercase">FEATURES</h4>
                      <ul className="space-y-2 text-sm lg:text-base text-[#6D4C41]">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513]" />
                          Handcrafted by skilled artisans
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513]" />
                          Authentic traditional design
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513]" />
                          Premium quality materials
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513]" />
                          Perfect for daily pooja rituals
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <div className="pt-6 mt-auto border-t border-[#D7CCC8]/30">
                    <motion.button
                      className="w-full bg-[#FF9933] text-white py-4 rounded-full font-bold text-lg hover:bg-[#E68A00] transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-98"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={22} className="stroke-[3px]" />
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </div>
            </BlurPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
