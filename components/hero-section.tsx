"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { PackageCheck, Sparkles, ShieldCheck } from "lucide-react"
import { Reveal } from "./reveal"
import { BlurPanel } from "./blur-panel"
import { supabase } from "@/lib/supabaseClient"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // State for dynamic content
  const [heroContent, setHeroContent] = useState({
    backgroundUrl: "/traditional-indian-pooja-setup-with-brass-items-di.jpg",
    heroText: "Authentic Pooja Items",
    subText: "for Sacred Rituals"
  })

  useEffect(() => {
    const fetchHeroContent = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .single()

      if (data) {
        setHeroContent({
          backgroundUrl: data.background_url || heroContent.backgroundUrl,
          heroText: data.hero_text || heroContent.heroText,
          subText: data.sub_text || heroContent.subText
        })
      }
    }

    fetchHeroContent()
  }, [])

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const AnimatedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    // Split by words to keep them together
    const words = text.split(" ")

    return (
      <span className="inline-block">
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: delay + (wordIndex * 0.1) + (charIndex * 0.03),
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </span>
    )
  }

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Background Image with warm overlay */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, y: imageY }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <Image
          src={heroContent.backgroundUrl}
          alt="Sri Sai Cottage Industries - Traditional pooja items and spiritual accessories"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B4513]/40 via-[#FF9933]/20 to-[#2C1810]/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex items-center justify-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="container-custom text-center text-white">
          <Reveal>
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight mb-6">
              <AnimatedText text={heroContent.heroText} delay={0.5} />
              <br />
              <span className="italic font-light text-[#DAA520]">
                <AnimatedText text={heroContent.subText} delay={1.1} />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <motion.p
              className="text-lg md:text-xl text-white/95 mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              Handcrafted with devotion — Premium quality pooja essentials, spiritual accessories, and traditional items
              for your sacred space.
            </motion.p>
          </Reveal>

          <Reveal delay={0.4}>
            <motion.button
              className="bg-[#FF9933] hover:bg-[#DAA520] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Collection
            </motion.button>
          </Reveal>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <BlurPanel className="mx-6 mb-6 px-6 py-4 bg-[#2C1810]/60 backdrop-blur-md border-[#DAA520]/30">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-white/95">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[#DAA520]" />
              <span className="text-sm md:text-base">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF9933]" />
              <span className="text-sm md:text-base">Handcrafted Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#DAA520]" />
              <span className="text-sm md:text-base">Authentic Products</span>
            </div>
          </div>
        </BlurPanel>
      </motion.div>
    </section>
  )
}
