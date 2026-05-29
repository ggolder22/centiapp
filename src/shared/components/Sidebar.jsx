import { NavLink } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, Calendar, Bot, Briefcase, FolderKanban, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const links = [
  { to: '/',            label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/finanzas',    label: 'Finanzas',   icon: TrendingUp },
  { to: '/proyectos',   label: 'Proyectos',  icon: FolderKanban },
  { to: '/calendario',  label: 'Calendario', icon: Calendar },
  { to: '/asistente',   label: 'Asistente',  icon: Bot },
  { to: '/trabajo',     label: 'Trabajo',    icon: Briefcase },
]

export default function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)

  return (
    <aside className="w-56 shrink-0 bg-gray-900 text-white min-h-screen flex flex-col py-6 px-3">
      <div className="px-3 mb-6">
        <h1 className="text-xl font-bold text-indigo-400 tracking-tight">CentiApp</h1>
        <p className="text-xs text-gray-400 mt-0.5">Control personal</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-700 pt-4 mt-4 px-3 space-y-3">
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-rose-400 transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
