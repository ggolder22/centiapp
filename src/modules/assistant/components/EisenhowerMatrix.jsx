import { Trash2, CheckCircle2 } from 'lucide-react'
import { useTaskStore } from '../../../store/taskStore'

const quadrants = [
  { key: 'q1', label: '🔴 Hacer hoy',  sub: 'Urgente + Importante',     border: 'border-rose-500',   badge: 'bg-rose-900 text-rose-300' },
  { key: 'q2', label: '🟡 Planificar', sub: 'Importante, no urgente',   border: 'border-yellow-500', badge: 'bg-yellow-900 text-yellow-300' },
  { key: 'q3', label: '🟠 Reducir',    sub: 'Urgente, no importante',   border: 'border-orange-500', badge: 'bg-orange-900 text-orange-300' },
  { key: 'q4', label: '⚪ Eliminar',   sub: 'Ni urgente ni importante', border: 'border-gray-600',   badge: 'bg-gray-700 text-gray-400' },
]

export default function EisenhowerMatrix() {
  const tasks = useTaskStore((s) => s.tasks)
  const updateStatus = useTaskStore((s) => s.updateStatus)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  const classified = tasks.filter((t) => t.quadrant)
  if (classified.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-gray-100">Matriz de prioridades</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quadrants.map(({ key, label, sub, border, badge }) => {
          const items = classified.filter((t) => t.quadrant === key)
          return (
            <div key={key} className={`bg-gray-800 rounded-xl p-4 border-l-4 ${border} space-y-2`}>
              <div>
                <p className="text-sm font-semibold text-gray-100">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
              {items.length === 0 ? (
                <p className="text-xs text-gray-600 italic">Sin tareas</p>
              ) : (
                <ul className="space-y-1.5">
                  {items.map((t) => (
                    <li key={t.id} className="flex items-center gap-2 group">
                      <span className="flex-1 text-sm text-gray-300 truncate">{t.title}</span>
                      {t.pomodoros > 0 && <span className="text-xs text-orange-400">🍅{t.pomodoros}</span>}
                      <button
                        onClick={() => updateStatus(t.id, 'done')}
                        className="text-gray-600 hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Hecho"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="text-gray-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
