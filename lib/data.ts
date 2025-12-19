export interface VariantOption {
    label: string
    price?: string
}

export interface Product {
    id: string
    name: string
    price: string
    originalPrice?: string
    images: string[]
    badge?: string
    tagline?: string
    description?: string // Made optional to match shop-context
    category: string
    variants?: { type: string, options: (string | VariantOption)[] }[]
    swatches?: { name: string; color: string }[]
}

export const initialProducts: Product[] = [
    {
        id: "1",
        name: "Brass Ganesha Idol",
        price: "2499",
        originalPrice: "3999",
        images: [
            "/beautiful-brass-ganesha-idol-statue-indian-traditi.jpg",
            "/brass-ganesha-idol-front-view.jpg",
            "/brass-ganesha-idol-side-view.jpg",
        ],
        badge: "Bestseller",
        category: "Idols",
        tagline: "Divine blessings for your home",
        description: "About this item\nBring home prosperity and good luck with this beautifully handcrafted Brass Ganesha Idol. Perfect for your home altar or as a thoughtful gift.\n\nMaterial: Pure Brass\nDimensions: H: 15cm × W: 10cm\nWeight: 1.2 kg\n\nCare Instructions: Clean with a soft, dry cloth. Avoid using harsh chemicals.\nHandcrafted by skilled artisans in India, ensuring authentic traditional design.",
        variants: [
            {
                type: "Size",
                options: [
                    { label: "Medium (15cm)", price: "2499" },
                    { label: "Large (25cm)", price: "4499" }
                ]
            }
        ],
        swatches: [
            { name: "Antique Brass", color: "#B8860B" },
            { name: "Polished Brass", color: "#DAA520" }
        ]
    },
    {
        id: "2",
        name: "Pooja Thali Set",
        price: "1899",
        originalPrice: "2499",
        images: ["/ornate-brass-pooja-thali-set-with-diya-bell-tradit.jpg"],
        badge: "New",
        category: "Pooja Essentials",
        tagline: "Complete set for your rituals",
        description: "About this item\nA complete Pooja Thali Set designed to make your daily rituals convenient and elegant.\n\nSet Includes: Thali, Diya, Bell, Incense Holder, and Kumkum containers.\nMaterial: High-quality Brass with intricate engraving.\nDiameter: 12 inches\n\nIdeal for festivals like Diwali, Navratri, and daily worship. Easy to clean and maintain.",
    },
    {
        id: "3",
        name: "Premium Agarbatti Collection",
        price: "599",
        originalPrice: "799",
        images: ["/premium-incense-sticks-agarbatti-collection-indian.jpg"],
        badge: "Popular",
        category: "Pooja Essentials",
        tagline: "Fragrance that elevates your soul",
        description: "About this item\nCycle Pure Agarbathies are Eco-friendly, Non Toxic and fills Positive Energy.\nFragrances : Woody, Spicy, Powdery, Bouquet, Perfumic, Oriental, Lily, Intimate, Fancy\nPrimary Material : Bamboo, Length : 9 Inch Burning Time : 40 Minutes\nThe package contains incense sticks pack of 2 with 250gm sticks each box .Easy to use and suitable for everyone, these incense sticks worth your time. You can also gift it to your dear ones on a special occasion to make them feel special and loved.\nDirection for Use & Caution: Light the coated end of agarbathi and allow flame to catch. Gentle put out of the flame. Place agarbathi on a fireproof and heat resistant surface, away from inflammable material. Use agarbathi with care and in well ventilated spaces.",
    },
]
