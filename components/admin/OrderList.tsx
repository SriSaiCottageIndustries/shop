"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Trash2, Calendar, FileText, IndianRupee } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { format } from "date-fns"
import { LoadingAnimation } from "@/components/ui/loading-animation"

interface OrderListProps {
    viewMode: 'all' | 'today'
    sourceFilter?: 'web' | 'pos' | 'all'
    onBack: () => void
}

export function OrderList({ viewMode, sourceFilter = 'all', onBack }: OrderListProps) {
    const [orders, setOrders] = useState<any[]>([])
    const [filteredOrders, setFilteredOrders] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [viewMode, sourceFilter])

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredOrders(orders)
        } else {
            const lowerQuery = searchQuery.toLowerCase()
            setFilteredOrders(orders.filter(order =>
                (order.customer_name || "").toLowerCase().includes(lowerQuery)
            ))
        }
    }, [searchQuery, orders])

    const fetchOrders = async () => {
        setLoading(true)
        let query = supabase.from('orders').select('*').order('created_at', { ascending: false })

        if (sourceFilter !== 'all') {
            query = query.eq('source', sourceFilter)
        }

        if (viewMode === 'today') {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            query = query.gte('created_at', startOfDay.toISOString())
        }

        const { data, error } = await query

        if (error) {
            toast.error("Failed to fetch orders")
            console.error(error)
        } else {
            setOrders(data || [])
            setFilteredOrders(data || [])
        }
        setLoading(false)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this order? This cannot be undone.")) return

        const { error } = await supabase.from('orders').delete().eq('id', id)
        if (error) {
            toast.error("Failed to delete order")
        } else {
            toast.success("Order deleted")
            setOrders(orders.filter(o => o.id !== id)) // Filter effect will auto-update
        }
    }

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-[#2C1810]" />
                    </button>
                    <h2 className="text-2xl font-bold text-[#2C1810]">
                        {sourceFilter === 'pos' && "Billing Data (POS History)"}
                        {sourceFilter === 'web' && "E-commerce Orders (Web)"}
                        {sourceFilter === 'all' && (viewMode === 'today' ? "Today's Orders" : "All Orders")}
                    </h2>
                </div>

                {viewMode === 'all' && (
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by Customer Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-4 pr-4 py-2 border rounded-lg w-full md:w-64 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                        />
                    </div>
                )}
            </div>



            {loading ? (
                <LoadingAnimation />
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-[#EFEBE9]">
                    <p className="text-gray-500">No orders found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg p-6 shadow-sm border border-[#EFEBE9] hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-center gap-4">

                            {/* Left: Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-[#2C1810]">{order.customer_name || "Unknown Customer"}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {order.status || 'Pending'}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${order.source === 'web' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                                        {order.source === 'web' ? 'WEB' : 'POS'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <Calendar size={14} /> {format(new Date(order.created_at), "PPpp")}
                                </p>
                            </div>

                            {/* Middle: Amount */}
                            <div className="text-right px-4">
                                <p className="text-2xl font-bold text-[#FF9933]">₹{order.total_amount}</p>
                            </div>

                            {/* Right: Actions */}
                            <div>
                                <button
                                    onClick={() => handleDelete(order.id)}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Order"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
