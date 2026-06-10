import { useState } from 'react'
import { CheckCircle2, Circle, Timer } from 'lucide-react'
import { useTaskStore } from '../../../store/taskStore'
import PomodoroTimer from './PomodoroTimer'

export default function MITSection() {
  const getMITs = useTaskStore((s) => s.getMITs)
  const updateStatus = useTaskStore((s) => s.updateStatus)
  const [activePomodoro, setActivePomodoro] = useState(null)
  const mits = getMITs()

  if (mits.length === 0) return null

  return (
    <div className="bg-gray-800 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-100">🎯 Tus 3 tareas de hoy</h2>
        <span className="text-xs text-gray-500">MITs — Most Important Tasks</span>
      </div>

      <ul className="space-y-2">
        {mits.map((task, i) => (
          <li key={task.id} className="flex items-center gap-3 bg-gray-750 rounded-lg p-3 bg-gray-900">
            <span className="text-xs font-bold text-gray-500 w-4">{i + 1}</span>
            <button
              onClick={() => updateStatus(task.id, 'done')}
              className="text-gray-500 hover:text-emerald-400 transition-colors shrink-0"
              title="Marcar como hecho"
            >
              {task.status === 'doing' ? <Circle size={18} className="text-indigo-400" /> : <Circle size={18} />}
            </button>
            <span className="flex-1 text-sm text-gray-100">{task.title}</span>
            {task.pomodoros > 0 && (
              <span className="text-xs text-orange-400">🍅 {task.pomodoros}</span>
            )}
            <button
              onClick={() => setActivePomodoro(activePomodoro === task.id ? null : task.id)}
              className={`p-1.5 rounded-lg transition-colors ${activePomodoro === task.id ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-orange-700 hover:text-white'}`}
              title="Iniciar Pomodoro"
            >
              <Timer size={14} />
            </button>
          </li>
        ))}
      </ul>

      {activePomodoro && (
        <PomodoroTimer
          taskId={activePomodoro}
          taskTitle={mits.find((t) => t.id === activePomodoro)?.title}
          onClose={() => setActivePomodoro(null)}
        />
      )}
    </div>
  )
}
