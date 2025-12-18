"use client"

import { Header } from "@/components/header"
import { FeaturedProducts } from "@/components/featured-products"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ProductsContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")

  return (
    <div className="min-h-screen bg-[#FFF8DC]">
      <Header />
      <main className="pt-24">
        <div className="container-custom py-12">
          <h1 className="text-5xl font-bold text-[#2C1810] mb-4 text-center">
            {category ? (
              <>
                <span className="italic font-light text-[#8B4513]">{category}</span> Products
              </>
            ) : (
              <>
                All <span className="italic font-light text-[#8B4513]">Products</span>
              </>
            )}
          </h1>
          <p className="text-lg text-[#6D4C41] text-center mb-12 max-w-2xl mx-auto">
            {category
              ? `Browse our ${category.toLowerCase()} collection`
              : "Browse our complete collection of authentic pooja items"}
          </p>
        </div>
        <FeaturedProducts filterCategory={category} />
      </main>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF8DC]" />}>
      <ProductsContent />
    </Suspense>
  )
}
