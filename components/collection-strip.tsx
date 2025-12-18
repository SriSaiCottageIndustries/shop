"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Reveal } from "./reveal"

const collections = [
  {
    id: "brass-idols",
    name: "BRASS IDOLS",
    image: "/brass-hindu-deity-idols.jpg",
    count: "12 items",
  },
  {
    id: "pooja-thalis",
    name: "POOJA THALIS",
    image: "/brass-pooja-thali-sets.jpg",
    count: "8 items",
  },
  {
    id: "incense-dhoop",
    name: "INCENSE & DHOOP",
    image: "/agarbatti-incense-sticks.jpg",
    count: "15 items",
  },
  {
    id: "diya-lamps",
    name: "DIYA & LAMPS",
    image: "/brass-oil-diya-lamps.jpg",
    count: "10 items",
  },
  {
    id: "bells-ghanti",
    name: "BELLS & GHANTI",
    image: "/brass-temple-bells.jpg",
    count: "6 items",
  },
  {
    id: "puja-accessories",
    name: "PUJA ACCESSORIES",
    image: "/pooja-ritual-items.jpg",
    count: "18 items",
  },
]

export function CollectionStrip() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -100])

  const itemWidth = 320
  const totalWidth = collections.length * (itemWidth + 32) - 32
  const containerWidth = typeof window !== "undefined" ? window.innerWidth : 1200
  const maxDrag = Math.max(0, totalWidth - containerWidth + 48)

  return (
    <section ref={containerRef} className="py-20 lg:py-32 overflow-hidden bg-white">
      <div className="mb-12">
        <Reveal>
          <div className="container-custom text-center">
            <h2 className="text-[#2C1810] mb-4 text-5xl lg:text-6xl font-bold">
              Product <span className="italic font-light text-[#8B4513]">Categories</span>
            </h2>
            <p className="text-lg text-[#6D4C41] max-w-2xl mx-auto leading-relaxed">
              Explore our diverse range of traditional pooja items, each category crafted with devotion and care.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="relative">
        <motion.div
          className="flex gap-8 px-6"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.1}
        >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              className="flex-shrink-0 w-80 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Link href={`/products?category=${encodeURIComponent(collection.name)}`}>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                  <motion.div
                    className="relative w-full h-full"
                    whileHover={{ filter: "blur(1px)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8B4513]/80 to-transparent group-hover:from-[#8B4513]/90 transition-all duration-300" />
                  </motion.div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="text-center text-white"
                      initial={{ opacity: 0.9 }}
                      whileHover={{ opacity: 1, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl lg:text-3xl font-bold tracking-wider mb-2">{collection.name}</h3>
                      <p className="text-sm opacity-90">{collection.count}</p>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-[#A1887F]">← Drag to explore categories →</p>
      </div>
    </section>
  )
}
