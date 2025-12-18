"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Trash2, Plus, Minus } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { CheckoutModal } from "@/components/checkout-modal"

export default function CartPage() {
  const { items, addItem, removeItem, updateQuantity, cartTotal } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const shipping = 0
  const total = cartTotal + shipping

  return (
    <div className="min-h-screen bg-[#FFF8DC]">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom py-12">
          <h1 className="text-5xl font-bold text-[#2C1810] mb-12 text-center">
            Shopping <span className="italic font-light text-[#8B4513]">Cart</span>
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-[#6D4C41]">Your cart is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    className="bg-white rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 pr-4 sm:pr-10">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-[#2C1810] mb-1">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id, item.selectedVariants)}
                          className="text-red-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-full -mt-1 -mr-2 sm:mr-0"
                          title="Remove Item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Variants Display */}
                      {item.selectedVariants && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {Object.entries(item.selectedVariants).map(([key, val]) => (
                            <span key={key} className="text-xs text-[#8B4513] bg-[#FFF8F0] px-2 py-0.5 rounded border border-[#D7CCC8]">
                              {val}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-[#8B4513] font-bold">{item.price}</p>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between mt-4 sm:mt-0">
                      <div className="flex items-center gap-3 bg-[#EFEBE9] rounded-full px-4 py-1.5 self-start sm:self-auto mt-2 sm:mt-0">
                        <button onClick={() => { if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1, item.selectedVariants); else removeItem(item.id, item.selectedVariants) }} className="text-[#8B4513] hover:bg-black/5 rounded-full p-1" title="Decrease">
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center font-medium text-[#2C1810] text-sm">{item.quantity}</span>
                        <button onClick={() => addItem(item)} className="text-[#8B4513] hover:bg-black/5 rounded-full p-1" title="Increase">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-[#6D4C41]">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-[#6D4C41]">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="text-sm text-[#8B4513] italic">
                      All over Tamil Nadu delivery available
                    </div>
                    <div className="border-t border-[#D7CCC8] pt-4">
                      <div className="flex justify-between text-lg font-bold text-[#2C1810]">
                        <span>Total</span>
                        <span>₹{total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    className="w-full bg-[#FF9933] text-white py-4 rounded-full font-medium text-lg hover:bg-[#DAA520] transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCheckoutOpen(true)}
                  >
                    Proceed to Checkout
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={total}
        items={items}
      />
    </div>
  )
}
