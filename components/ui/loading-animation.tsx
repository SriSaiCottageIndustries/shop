"use client"

import { motion } from "framer-motion"

export function LoadingAnimation() {
    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[50vh] w-full">
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Outer Ring - Rotating Mandala-like */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-[#D7CCC8] rounded-full"
                />

                {/* Middle Ring - Counter Rotating */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border border-[#8B4513]/20 rounded-full"
                />

                {/* Inner Pulsing Circle */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-12 h-12 bg-[#FF9933]/10 rounded-full blur-sm absolute"
                />

                {/* Center Icon / Symbol */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                >
                    {/* Abstract Lotus / Diya Shape using raw SVG path */}
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF9933]">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        <circle cx="12" cy="12" r="3" className="fill-[#8B4513]/20 stroke-none" />
                    </svg>
                </motion.div>
            </div>

            {/* Text */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 flex flex-col items-center"
            >
                <h3 className="text-[#2C1810] font-serif font-medium tracking-widest uppercase text-sm">Loading</h3>
                <div className="flex gap-1 mt-1 justify-center">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 bg-[#FF9933] rounded-full"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
