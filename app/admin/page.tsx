"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { EcommerceManager } from "@/components/admin/EcommerceManager"
import { BillingView } from "@/components/admin/BillingView"
import { OrderList } from "@/components/admin/OrderList"
import { ShoppingBag, CreditCard, FileText, Calendar, Edit } from "lucide-react"

export default function AdminPage() {
  const [currentView, setCurrentView] = useState('dashboard')

  const renderView = () => {
    switch (currentView) {
      case 'ecommerce':
        return <EcommerceManager onBack={() => setCurrentView('dashboard')} />
      case 'billing':
        return <BillingView onBack={() => setCurrentView('dashboard')} />
      case 'billing-data':
        return <OrderList viewMode="all" sourceFilter="pos" onBack={() => setCurrentView('dashboard')} />
      case 'today':
        return <OrderList viewMode="today" sourceFilter="web" onBack={() => setCurrentView('dashboard')} />
      default:
        return (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
            {/* 1. Billing Page */}
            <button
              onClick={() => setCurrentView('billing')}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-[#FF9933] group flex flex-col items-center gap-4 text-center"
            >
              <div className="bg-[#FFF8F0] p-4 rounded-full group-hover:bg-[#FF9933] group-hover:text-white transition-colors text-[#FF9933]">
                <CreditCard size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#2C1810] mb-2">Billing Page</h2>
                <p className="text-gray-500">Create new manual bills (POS)</p>
              </div>
            </button>

            {/* 2. Order Details */}
            <button
              onClick={() => setCurrentView('today')}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-[#6D4C41] group flex flex-col items-center gap-4 text-center"
            >
              <div className="bg-[#FFF8F0] p-4 rounded-full group-hover:bg-[#6D4C41] group-hover:text-white transition-colors text-[#6D4C41]">
                <Calendar size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#2C1810] mb-2">Order Details</h2>
                <p className="text-gray-500">View today's orders</p>
              </div>
            </button>

            {/* 3. Billing Data */}
            <button
              onClick={() => setCurrentView('billing-data')}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-[#5D4037] group flex flex-col items-center gap-4 text-center"
            >
              <div className="bg-[#FFF8F0] p-4 rounded-full group-hover:bg-[#5D4037] group-hover:text-white transition-colors text-[#5D4037]">
                <FileText size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#2C1810] mb-2">Billing Data</h2>
                <p className="text-gray-500">View complete order history</p>
              </div>
            </button>

            {/* 4. E-commerce Edit */}
            <button
              onClick={() => setCurrentView('ecommerce')}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-[#8B4513] group flex flex-col items-center gap-4 text-center"
            >
              <div className="bg-[#FFF8F0] p-4 rounded-full group-hover:bg-[#8B4513] group-hover:text-white transition-colors text-[#8B4513]">
                <Edit size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#2C1810] mb-2">E-commerce Edit</h2>
                <p className="text-gray-500">Manage products, categories, and site settings</p>
              </div>
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8DC]">
      <Header />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {currentView === 'dashboard' && (
            <h1 className="text-4xl font-bold text-[#2C1810] mb-8 text-center">
              Admin <span className="italic font-light text-[#8B4513]">Dashboard</span>
            </h1>
          )}
          {renderView()}
        </div>
      </main>
    </div>
  )
}
