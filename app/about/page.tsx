"use client"

import { Header } from "@/components/header"
import { Reveal } from "@/components/reveal"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFF8DC]">
      <Header />
      <main className="pt-24">
        <div className="container-custom py-16">
          <Reveal>
            <h1 className="text-5xl font-bold text-[#2C1810] mb-4 text-center">
              About <span className="italic font-light text-[#8B4513]">Us</span>
            </h1>
          </Reveal>

          <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <Reveal delay={0.2}>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold text-[#8B4513] mb-4">Sri Sai Cottage Industries</h2>
                <p className="text-lg text-[#6D4C41] leading-relaxed mb-4">
                  Welcome to Sri Sai Cottage Industries, your trusted source for authentic traditional pooja items and
                  spiritual accessories. For over 25 years, we have been dedicated to serving devotees across India with
                  handcrafted, high-quality religious products.
                </p>
                <p className="text-lg text-[#6D4C41] leading-relaxed">
                  Our artisans craft each item with devotion and care, ensuring that every product meets the highest
                  standards of quality and authenticity. From brass idols to incense and puja accessories, we offer a
                  complete range of items for your daily worship and special ceremonies.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">Our Mission</h3>
                <p className="text-lg text-[#6D4C41] leading-relaxed">
                  To preserve and promote traditional Indian craftsmanship while making authentic pooja items accessible
                  to every household. We believe in supporting local artisans and maintaining the rich heritage of
                  Indian spiritual traditions.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-[#8B4513] mb-4">Why Choose Us</h3>
                <ul className="space-y-3 text-lg text-[#6D4C41]">
                  <li>• Handcrafted by skilled traditional artisans</li>
                  <li>• 100% authentic and genuine materials</li>
                  <li>• Competitive Indian market pricing</li>
                  <li>• Nationwide delivery across India</li>
                  <li>• Quality assurance on all products</li>
                  <li>• Supporting local craftsmen communities</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  )
}
