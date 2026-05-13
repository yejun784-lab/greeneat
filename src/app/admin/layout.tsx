import { AdminNav } from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-wash flex">
      <AdminNav />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
