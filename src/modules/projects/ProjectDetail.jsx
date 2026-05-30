import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, TrendingDown } from 'lucide-react'
import { useProjectStore } from '../../store/projectStore'

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

const statusOptions = ['activo', 'pausado', 'finalizado']
const statusColors = {
  activo: 'bg-emerald-900 text-emerald-400',
  pausado: 'bg-yellow-900 text-yellow-400',
  finalizado: 'bg-gray-700 text-gray-400',
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, fetchProjects, updateProject, deleteProject, getProjectExpenses } = useProjectStore()
  const [expenses, setExpenses] = useState([])
  const [loadingExp, setLoadingExp] = useState(true)

  useEffect(() => {
    if (projects.length === 0) fetchProjects()
  }, [projects.length, fetchProjects])

  useEffect(() => {
    getProjectExpenses(id).then((data) => { setExpenses(data); setLoadingExp(false) })
  }, [id, getProjectExpenses])

  const project = projects.find((p) => p.id === id)

  if (!project) {
    return <p className="text-gray-400 text-sm">Cargando proyecto...</p>
  }

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const budgetUsed = project.budget ? (total / project.budget) * 100 : null

  const handleDelete = async () => {
    await deleteProject(id)
    navigate('/proyectos')
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => navigate('/proyectos')} className="text-gray-400 hover:text-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-100">{project.name}</h1>
          {project.description && <p className="text-sm text-gray-400 mt-0.5">{project.description}</p>}
        </div>
        <select
          value={project.status}
          onChange={(e) => updateProject(id, { status: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {statusOptions.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={handleDelete} className="p-2 rounded-lg bg-gray-800 hover:bg-rose-900 text-gray-400 hover:text-rose-400 transition-colors" title="Eliminar proyecto">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400">Total gastado</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">{fmt(total)}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400">Presupuesto</p>
          <p className="text-2xl font-bold text-gray-100 mt-1">
            {project.budget ? fmt(project.budget) : <span className="text-gray-500 text-base">Sin definir</span>}
          </p>
          {budgetUsed !== null && (
            <div className="mt-2">
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${budgetUsed > 90 ? 'bg-rose-500' : budgetUsed > 60 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{budgetUsed.toFixed(0)}% utilizado</p>
            </div>
          )}
        </div>
      </div>

      {/* Gastos */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700">
          <h2 className="text-base font-semibold text-gray-100">Gastos del proyecto</h2>
        </div>
        {loadingExp ? (
          <p className="text-gray-500 text-sm p-5">Cargando...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500 text-sm p-5">Sin gastos registrados. Asociá gastos desde el módulo de Finanzas.</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {expenses.map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-5 py-3">
                <div className="p-1.5 rounded-lg bg-rose-900">
                  <TrendingDown size={14} className="text-rose-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-100 truncate">{e.description || e.category}</p>
                  <p className="text-xs text-gray-500">{e.category} · {e.date}</p>
                </div>
                <span className="text-sm font-semibold text-rose-400">-{fmt(e.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
