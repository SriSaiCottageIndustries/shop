"use client"

import { Header } from "@/components/header"
import { motion } from "framer-motion"
import { Reveal } from "@/components/reveal"
import { useShop } from "@/lib/shop-context"

export default function CategoriesPage() {
  const { categories, products } = useShop()

  const handleCategoryClick = (categoryName: string) => {
    window.location.href = `/products?category=${encodeURIComponent(categoryName)}`
  }

  const getCategoryCount = (catName: string) => {
    return products.filter(p => p.category === catName).length
  }

  return (
    <div className="min-h-screen bg-[#FFF8DC]">
      <Header />
      <main className="pt-24">
        <div className="container-custom py-12">
          <Reveal>
            <h1 className="text-5xl font-bold text-[#2C1810] mb-4 text-center">
              Product <span className="italic font-light text-[#8B4513]">Categories</span>
            </h1>
            <p className="text-lg text-[#6D4C41] text-center mb-16 max-w-2xl mx-auto">
              Explore our diverse range of traditional pooja items organized by category
            </p>
          </Reveal>

          {categories.length === 0 ? (
            <div className="text-center text-xl text-[#8B4513]">No categories found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Reveal key={category.id} delay={index * 0.1}>
                  <motion.div
                    className="group relative overflow-hidden rounded-lg bg-white cursor-pointer shadow-md"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/60 to-transparent z-10" />
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                      <p className="text-white/80">{getCategoryCount(category.name)} Products</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
