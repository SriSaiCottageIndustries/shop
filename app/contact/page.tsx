"use client"

import { Header } from "@/components/header"
import { Reveal } from "@/components/reveal"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FFF8DC]">
      <Header />
      <main className="pt-24">
        <div className="container-custom py-16 pb-32">
          <Reveal>
            <h1 className="text-5xl font-bold text-[#2C1810] mb-4 text-center">
              Contact <span className="italic font-light text-[#8B4513]">Us</span>
            </h1>
            <p className="text-lg text-[#6D4C41] text-center mb-16 max-w-2xl mx-auto">
              Get in touch with us for inquiries, bulk orders, or custom requests
            </p>
          </Reveal>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Reveal delay={0.2}>
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-sm flex gap-4">
                  <MapPin className="w-6 h-6 text-[#FF9933] flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-[#2C1810] mb-2">Address</h3>
                    <p className="text-[#6D4C41]">
                      Sri Sai Cottage Industries
                      <br />
                      123, Temple Street, Gandhi Nagar
                      <br />
                      Mumbai, Maharashtra 400001
                      <br />
                      India
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm flex gap-4">
                  <Phone className="w-6 h-6 text-[#FF9933] flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-[#2C1810] mb-2">Phone</h3>
                    <p className="text-[#6D4C41]">+91 98765 43210</p>
                    <p className="text-[#6D4C41]">+91 98765 43211 (WhatsApp)</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm flex gap-4">
                  <Mail className="w-6 h-6 text-[#FF9933] flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-[#2C1810] mb-2">Email</h3>
                    <p className="text-[#6D4C41]">info@srisaicottage.com</p>
                    <p className="text-[#6D4C41]">orders@srisaicottage.com</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm flex gap-4">
                  <Clock className="w-6 h-6 text-[#FF9933] flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-[#2C1810] mb-2">Business Hours</h3>
                    <p className="text-[#6D4C41]">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                    <p className="text-[#6D4C41]">Sunday: 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Send us a message</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2C1810] mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-[#D7CCC8] focus:outline-none focus:ring-2 focus:ring-[#FF9933] bg-[#FFF8DC]"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C1810] mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-[#D7CCC8] focus:outline-none focus:ring-2 focus:ring-[#FF9933] bg-[#FFF8DC]"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C1810] mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border border-[#D7CCC8] focus:outline-none focus:ring-2 focus:ring-[#FF9933] bg-[#FFF8DC]"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C1810] mb-2">Message</label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-[#D7CCC8] focus:outline-none focus:ring-2 focus:ring-[#FF9933] bg-[#FFF8DC]"
                      placeholder="Your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#FF9933] text-white py-3 rounded-lg font-medium hover:bg-[#DAA520] transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  )
}
