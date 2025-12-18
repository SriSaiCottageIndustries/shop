"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X, Upload, Loader2, ImageIcon, Layers, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { useShop } from "@/lib/shop-context"

interface EcommerceManagerProps {
    onBack: () => void
}

export function EcommerceManager({ onBack }: EcommerceManagerProps) {
    const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory } = useShop()

    const [editingId, setEditingId] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Category State
    const [isManagingCategories, setIsManagingCategories] = useState(false)
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
    const [categoryForm, setCategoryForm] = useState({ id: "", name: "", image: "" })

    // Home Screen Settings State
    const [homeSettings, setHomeSettings] = useState({
        backgroundUrl: "/traditional-indian-pooja-setup-with-brass-items-di.jpg",
        heroText: "Authentic Pooja Items",
        subText: "for Sacred Rituals"
    })
    const [isEditingHome, setIsEditingHome] = useState(false)

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        price: "",
        originalPrice: "",
        images: [] as string[],
        badge: "",
        materials: "",
        tagline: "",
        description: "",
        category: "",
        variants: [] as { type: string, options: string[] }[]
    })

    useEffect(() => {
        fetchHomeSettings()
    }, [])

    const fetchHomeSettings = async () => {
        const { data } = await supabase.from('site_settings').select('*').single()
        if (data) {
            setHomeSettings({
                backgroundUrl: data.background_url || homeSettings.backgroundUrl,
                heroText: data.hero_text || homeSettings.heroText,
                subText: data.sub_text || homeSettings.subText
            })
        }
    }

    // --- Image Upload ---
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'home' | 'category') => {
        if (!e.target.files?.length) return
        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const bucket = type === 'category' ? 'category-images' : 'product-images'

        setUploading(true)
        try {
            const { error } = await supabase.storage.from(bucket).upload(fileName, file)
            if (error) throw error
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)

            if (type === 'product') {
                setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }))
            }
            else if (type === 'home') setHomeSettings({ ...homeSettings, backgroundUrl: publicUrl })
            else if (type === 'category') setCategoryForm({ ...categoryForm, image: publicUrl })

            toast.success("Image uploaded!")
        } catch (error: any) {
            toast.error(`Upload failed: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    // --- Product Handlers ---
    const handleEdit = (product: any) => {
        setEditingId(product.id)
        setFormData({
            ...product,
            materials: Array.isArray(product.materials) ? product.materials.join(", ") : product.materials,
            tagline: product.tagline || "",
            category: product.category || "",
            images: product.images || (product.image ? [product.image] : []),
            variants: product.variants || []
        })
        setIsAdding(true) // Reuse form view
    }

    const handleDelete = (id: string) => {
        if (confirm("Delete this product?")) deleteProduct(id)
    }

    const handleSave = () => {
        const materialsArray = formData.materials.split(",").map((m: string) => m.trim())
        const productData = {
            ...formData,
            materials: materialsArray,
            price: formData.price
        }

        if (editingId) {
            updateProduct(editingId, { ...productData, id: editingId } as any)
            setEditingId(null)
        } else {
            addProduct({ ...productData, id: Date.now().toString() } as any)
        }
        setIsAdding(false)
        resetForm()
    }

    // --- Category Handlers ---
    const handleEditCategory = (cat: any) => {
        setEditingCategoryId(cat.id)
        setCategoryForm(cat)
        setIsAddingCategory(true)
    }

    const handleDeleteCategory = (id: string) => {
        if (confirm("Delete this category?")) deleteCategory(id)
    }

    const handleSaveCategory = () => {
        if (editingCategoryId) {
            updateCategory(editingCategoryId, categoryForm)
            setEditingCategoryId(null)
        } else {
            addCategory({ ...categoryForm, id: Date.now().toString() })
        }
        setIsAddingCategory(false)
        setCategoryForm({ id: "", name: "", image: "" })
    }

    // --- Home Settings ---
    const handleSaveHomeSettings = async () => {
        await supabase.from('site_settings').upsert({ id: 1, background_url: homeSettings.backgroundUrl, hero_text: homeSettings.heroText, sub_text: homeSettings.subText })
        toast.success("Home settings saved!")
        setIsEditingHome(false)
    }

    const resetForm = () => {
        setFormData({ id: "", name: "", price: "", originalPrice: "", images: [], badge: "", materials: "", tagline: "", description: "", category: "", variants: [] })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-[#2C1810]" />
                </button>
                <h2 className="text-2xl font-bold text-[#2C1810]">E-commerce Management</h2>
            </div>

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => setIsEditingHome(!isEditingHome)} className="flex items-center gap-2 bg-[#8B4513] text-white px-4 py-2 rounded-lg hover:bg-[#6D4C41]">
                        <ImageIcon size={18} /> Home
                    </button>
                    <button onClick={() => setIsManagingCategories(!isManagingCategories)} className="flex items-center gap-2 bg-[#5D4037] text-white px-4 py-2 rounded-lg hover:bg-[#4E342E]">
                        <Layers size={18} /> Categories
                    </button>
                    <button onClick={() => { setIsAdding(true); resetForm(); setEditingId(null) }} className="flex items-center gap-2 bg-[#FF9933] text-white px-4 py-2 rounded-lg hover:bg-[#DAA520]">
                        <Plus size={18} /> Product
                    </button>
                </div>
            </div>

            {/* Home Settings Panel */}
            <AnimatePresence>
                {isEditingHome && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-lg p-6 mb-8 shadow-lg border-2 border-[#8B4513]/10 overflow-hidden">
                        <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Home Screen</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Background</label>
                                <div className="flex items-center gap-4">
                                    <img src={homeSettings.backgroundUrl} alt="Bg" className="w-20 h-20 object-cover rounded" />
                                    <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 flex items-center gap-2">
                                        {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />} Upload
                                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'home')} disabled={uploading} />
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <input value={homeSettings.heroText} onChange={e => setHomeSettings({ ...homeSettings, heroText: e.target.value })} className="w-full p-2 border rounded" placeholder="Hero Text" />
                                <input value={homeSettings.subText} onChange={e => setHomeSettings({ ...homeSettings, subText: e.target.value })} className="w-full p-2 border rounded" placeholder="Sub Text" />
                                <button onClick={handleSaveHomeSettings} className="bg-[#FF9933] text-white px-6 py-2 rounded">Save Settings</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Categories Management Panel */}
            <AnimatePresence>
                {isManagingCategories && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-lg p-6 mb-8 shadow-lg border-2 border-[#5D4037]/10 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#2C1810]">Categories</h2>
                            <button onClick={() => { setIsAddingCategory(true); setCategoryForm({ id: "", name: "", image: "" }); setEditingCategoryId(null) }} className="flex items-center gap-2 bg-[#FF9933] text-white px-4 py-2 rounded">
                                <Plus size={16} /> Add Category
                            </button>
                        </div>

                        <div className="mb-6 p-4 bg-[#FFF8DC] rounded-lg">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <input value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full p-2 border rounded" placeholder="Category Name" />
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Paste image URL..."
                                            className="flex-1 p-2 border rounded text-sm"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const val = e.currentTarget.value.trim()
                                                    if (val) setCategoryForm(prev => ({ ...prev, image: val }));
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {categoryForm.image && <img src={categoryForm.image} className="w-10 h-10 rounded object-cover" />}
                                        <label className="cursor-pointer bg-white px-3 py-2 border rounded flex gap-2 items-center text-sm">
                                            <Upload size={16} /> Upload Image
                                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'category')} disabled={uploading} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleSaveCategory} className="bg-[#2C1810] text-white px-4 py-2 rounded">Save Category</button>
                                <button onClick={() => setIsAddingCategory(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                            </div>
                        </div>

                        {/* Category List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {categories.map(cat => (
                                <div key={cat.id} className="border p-4 rounded-lg flex flex-col items-center bg-gray-50 relative group">
                                    <img src={cat.image || "/placeholder.svg"} className="w-full h-32 object-cover rounded mb-2" />
                                    <h3 className="font-bold text-[#2C1810]">{cat.name}</h3>
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditCategory(cat)} className="bg-white p-1 rounded-full shadow hover:text-blue-600"><Edit size={14} /></button>
                                        <button onClick={() => handleDeleteCategory(cat.id)} className="bg-white p-1 rounded-full shadow hover:text-red-600"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Product Form */}
            <AnimatePresence>
                {(isAdding || editingId) && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-lg p-6 mb-8 shadow-lg overflow-hidden">
                        <h2 className="text-2xl font-bold text-[#2C1810] mb-6">{editingId ? "Edit Product" : "Add Product"}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded bg-[#FFF8DC]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Price</label>
                                <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full p-2 border rounded bg-[#FFF8DC]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Original Price (MRP)</label>
                                <input type="text" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} className="w-full p-2 border rounded bg-[#FFF8DC]" placeholder="Optional" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded bg-[#FFF8DC]">
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Product Images (Upload or URL)</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Paste image URL here..."
                                        className="flex-1 p-2 border rounded bg-[#FFF8DC] text-sm"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value.trim()
                                                if (val) {
                                                    setFormData(prev => ({ ...prev, images: [...prev.images, val] }))
                                                    e.currentTarget.value = ""
                                                }
                                                e.preventDefault()
                                            }
                                        }}
                                        id="img-url-input"
                                    />
                                    <button
                                        onClick={() => {
                                            const input = document.getElementById('img-url-input') as HTMLInputElement
                                            const val = input.value.trim()
                                            if (val) {
                                                setFormData(prev => ({ ...prev, images: [...prev.images, val] }))
                                                input.value = ""
                                            }
                                        }}
                                        className="bg-[#2C1810] text-white px-4 py-2 rounded text-sm hover:bg-[#4E342E]"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(formData.images || []).map((img, idx) => (
                                        <div key={idx} className="relative w-16 h-16 rounded border overflow-hidden group">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="w-16 h-16 border-dashed border-2 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded text-gray-400">
                                        {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                                        <input type="file" multiple className="hidden" onChange={(e) => handleImageUpload(e, 'product')} disabled={uploading} />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tagline</label>
                                <input type="text" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} className="w-full p-2 border rounded bg-[#FFF8DC]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Badge</label>
                                <input type="text" value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="w-full p-2 border rounded bg-[#FFF8DC]" />
                            </div>

                            {/* Variants Section - Highlighted */}
                            <div className="md:col-span-2 border-2 border-[#FF9933]/30 bg-[#FFF8E1] p-4 rounded mt-4">
                                <h3 className="font-bold text-[#2C1810] mb-2 flex items-center gap-2">
                                    <Layers size={18} /> Variants (e.g. Size, Color)
                                </h3>
                                <p className="text-xs text-gray-500 mb-3">Add options like Size (S, M, L) or Color (Red, Blue) so customers can choose.</p>

                                {formData.variants && formData.variants.map((v: any, idx: number) => (
                                    <div key={idx} className="flex gap-2 mb-2 items-start bg-white p-2 rounded shadow-sm">
                                        <div className="flex-1">
                                            <input
                                                placeholder="Type (e.g. Color)"
                                                value={v.type}
                                                onChange={e => {
                                                    const newVariants = [...(formData.variants || [])]
                                                    newVariants[idx].type = e.target.value
                                                    setFormData({ ...formData, variants: newVariants })
                                                }}
                                                className="w-full p-2 border rounded text-sm mb-1"
                                            />
                                        </div>
                                        <div className="flex-[2]">
                                            <input
                                                placeholder="Options (comma separated, e.g. Red, Blue)"
                                                value={v.options.join(", ")}
                                                onChange={e => {
                                                    const newVariants = [...(formData.variants || [])]
                                                    newVariants[idx].options = e.target.value.split(",").map((s: string) => s.trim())
                                                    setFormData({ ...formData, variants: newVariants })
                                                }}
                                                className="w-full p-2 border rounded text-sm"
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newVariants = [...(formData.variants || [])]
                                                newVariants.splice(idx, 1)
                                                setFormData({ ...formData, variants: newVariants })
                                            }}
                                            className="text-red-500 p-2 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setFormData({ ...formData, variants: [...(formData.variants || []), { type: "", options: [] }] })}
                                    className="text-sm bg-[#2C1810] text-white px-3 py-2 rounded hover:bg-[#4E342E] flex items-center gap-2"
                                >
                                    <Plus size={14} /> Add Variant Type
                                </button>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={6} className="w-full p-2 border rounded bg-[#FFF8DC]" placeholder="Add 'About this item' and details..." />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button onClick={handleSave} disabled={uploading} className="bg-[#FF9933] text-white px-6 py-2 rounded flex gap-2 items-center hover:bg-[#DAA520]"><Save size={18} /> Save</button>
                            <button onClick={() => { setIsAdding(false); setEditingId(null) }} className="bg-[#6D4C41] text-white px-6 py-2 rounded flex gap-2 items-center hover:bg-[#8B4513]"><X size={18} /> Cancel</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Product List */}
            <div className="space-y-4">
                {products.map((product) => (
                    <motion.div key={product.id} layout className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-[#EFEBE9]">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-[#EFEBE9] rounded-lg overflow-hidden relative">
                                <img src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-[#2C1810] mb-1">{product.name}</h3>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(product)} className="p-2 bg-[#FFF8DC] text-[#8B4513] rounded-lg hover:bg-[#FFE0B2] transition-colors" title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-lg font-bold text-[#FF9933]">₹{product.price}</span>
                                        {product.originalPrice && <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>}
                                        {product.category && <span className="bg-[#EFEBE9] text-[#6D4C41] px-2 py-0.5 rounded text-xs font-semibold">{product.category}</span>}
                                    </div>

                                    {/* Display Variants in List */}
                                    {product.variants && product.variants.length > 0 && (
                                        <div className="flex gap-2 mb-2 flex-wrap">
                                            {product.variants.map((v: any, i: number) => (
                                                <span key={i} className="text-xs bg-gray-100 border px-2 py-1 rounded text-gray-700">
                                                    <strong>{v.type}:</strong> {v.options.join(", ")}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {product.tagline && <p className="text-sm text-[#8B4513] italic mb-2">{product.tagline}</p>}
                                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
