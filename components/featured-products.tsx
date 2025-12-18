"use client"

import { motion } from "framer-motion"
import { ProductCard } from "./product-card"
import { Reveal } from "./reveal"
import { useShop } from "@/lib/shop-context"

export function FeaturedProducts({ filterCategory }: { filterCategory?: string | null }) {
  const { products } = useShop()

  const displayProducts = filterCategory
    ? products.filter((p) => p.category === filterCategory)
    : products

  return (
    <section className="py-20 lg:py-32 bg-[#FFF8DC]" id="products">
      <div className="container-custom">
        {!filterCategory && (
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-6xl font-bold text-[#2C1810] mb-4">
                Featured <span className="italic font-light text-[#8B4513]">Collection</span>
              </h2>
              <p className="text-lg text-[#6D4C41] max-w-2xl mx-auto leading-relaxed">
                Discover our handpicked selection of authentic pooja items, crafted with devotion and traditional
                expertise for your sacred rituals.
              </p>
            </div>
          </Reveal>
        )}

        {displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-[#6D4C41]">No products found in this category.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.8,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    },
                  },
                }}
              >
                <Reveal delay={index * 0.1}>
                  <ProductCard product={product} />
                </Reveal>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
