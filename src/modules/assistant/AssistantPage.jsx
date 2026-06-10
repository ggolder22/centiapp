import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { useTaskStore } from '../../store/taskStore'
import TaskClassifier from './components/TaskClassifier'
import MITSection from './components/MITSection'
import EisenhowerMatrix from './components/EisenhowerMatrix'

export default function AssistantPage() {
  const { tasks, loading, fetchTasks, addTask } = useTaskStore()
  const [input, setInput] = useState('')
  const [pendingTask, setPendingTask] = useState(null)

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const handleAdd = async (e) => {
    e.preventDefault()
    const title = input.trim()
    if (!title) return
    setInput('')
    const task = await addTask(title)
    if (task) setPendingTask(task)
  }

  const unclassified = tasks.filter((t) => !t.quadrant)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Asistente de prioridades</h1>
        <p className="text-sm text-gray-400 mt-1">Vaciá la cabeza. Yo te ayudo a ordenar.</p>
      </div>

      {/* Brain dump */}
      <div className="bg-gray-800 rounded-xl p-5 space-y-3">
        <p className="text-sm text-gray-300 font-medium">¿Qué tenés en la cabeza ahora?</p>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribí una tarea o idea..."
            className="flex-1 bg-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-xs text-gray-500">Agregá todo lo que se te ocurra. Después lo clasificamos juntos.</p>
      </div>

      {/* Tareas sin clasificar */}
      {unclassified.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-100">Sin clasificar</h2>
            <button
              onClick={() => setPendingTask(unclassified[0])}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Clasificar siguiente →
            </button>
          </div>
          <ul className="space-y-1">
            {unclassified.map((t) => (
              <li key={t.id} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0" />
                <span className="text-sm text-gray-400">{t.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* MITs del día */}
      <MITSection />

      {/* Matriz Eisenhower */}
      <EisenhowerMatrix />

      {/* Clasificador modal */}
      {pendingTask && (
        <TaskClassifier
          task={pendingTask}
          onDone={() => {
            const next = unclassified.find((t) => t.id !== pendingTask.id)
            setPendingTask(next || null)
          }}
        />
      )}
    </div>
  )
}
