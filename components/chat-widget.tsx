"use client"

import { FaWhatsapp } from "react-icons/fa"

export function ChatWidget() {
    const phoneNumber = "919876543210" // Replace with actual number if provided, currently dummy or user needs to fill
    // Using a generic message
    const message = "Hello! I would like to know more about your products."

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp size={32} />
        </a>
    )
}
