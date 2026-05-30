import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 md:static md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header mobile */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setOpen(true)} className="text-gray-400 hover:text-gray-100 transition-colors">
            <Menu size={22} />
          </button>
          <span className="text-base font-bold text-indigo-400">CentiApp</span>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
