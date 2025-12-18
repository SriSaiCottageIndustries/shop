"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/lib/cart-context"

interface CheckoutModalProps {
    isOpen: boolean
    onClose: () => void
    total: number
    items: any[]
}

export function CheckoutModal({ isOpen, onClose, total, items }: CheckoutModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        address: "",
        email: "", // Optional for user, but good to have
    })
    const { clearCart } = useCart()

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    items,
                    total,
                }),
            })

            if (!response.ok) throw new Error("Failed to place order")

            toast.success("Order placed successfully! Details sent to admin.")
            clearCart()
            onClose()
            setFormData({ name: "", mobile: "", address: "", email: "" })
        } catch (error) {
            console.error(error)
            toast.error("Failed to place order. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Checkout</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#2C1810] mb-1">Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#2C1810] mb-1">Mobile Number</label>
                            <input
                                required
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                placeholder="10-digit number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#2C1810] mb-1">Email (Optional)</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#2C1810] mb-1">Delivery Address</label>
                            <textarea
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                placeholder="Full address with pincode"
                            />
                        </div>

                        <div className="pt-4 border-t border-[#D7CCC8]">
                            <div className="flex justify-between text-lg font-bold text-[#2C1810] mb-4">
                                <span>Total Amount</span>
                                <span>₹{total.toLocaleString("en-IN")}</span>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#FF9933] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#DAA520] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="animate-spin" size={20} />}
                                Place Order
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
