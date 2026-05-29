import { useNavigate } from 'react-router-dom'
import { Trash2, FolderOpen, CircleDot } from 'lucide-react'
import { useProjectStore } from '../../../store/projectStore'

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

const statusColors = {
  activo: 'bg-emerald-900 text-emerald-400',
  pausado: 'bg-yellow-900 text-yellow-400',
  finalizado: 'bg-gray-700 text-gray-400',
}

export default function ProjectCard({ project }) {
  const navigate = useNavigate()
  const deleteProject = useProjectStore((s) => s.deleteProject)

  return (
    <div className="bg-gray-800 rounded-xl p-5 flex flex-col gap-3 hover:ring-1 hover:ring-indigo-500 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-100 truncate">{project.name}</h3>
          {project.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColors[project.status] || statusColors.activo}`}>
          {project.status}
        </span>
      </div>

      {project.budget && (
        <p className="text-xs text-gray-400">
          Presupuesto: <span className="text-gray-200 font-medium">{fmt(project.budget)}</span>
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => navigate(`/proyectos/${project.id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white py-2 rounded-lg text-xs font-medium transition-colors"
        >
          <FolderOpen size={13} />
          Ver proyecto
        </button>
        <button
          onClick={() => deleteProject(project.id)}
          className="p-2 rounded-lg bg-gray-700 hover:bg-rose-900 text-gray-400 hover:text-rose-400 transition-colors"
          title="Eliminar"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
