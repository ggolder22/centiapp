import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, X } from 'lucide-react'
import { useTaskStore } from '../../../store/taskStore'

const WORK_MIN = 25
const BREAK_MIN = 5

export default function PomodoroTimer({ taskId, taskTitle, onClose }) {
  const incrementPomodoro = useTaskStore((s) => s.incrementPomodoro)
  const [seconds, setSeconds] = useState(WORK_MIN * 60)
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState('work') // 'work' | 'break'
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (phase === 'work') {
              incrementPomodoro(taskId)
              setPhase('break')
              return BREAK_MIN * 60
            } else {
              setPhase('work')
              return WORK_MIN * 60
            }
          }
          return s - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, phase, taskId, incrementPomodoro])

  const reset = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setPhase('work')
    setSeconds(WORK_MIN * 60)
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const progress = phase === 'work'
    ? 1 - seconds / (WORK_MIN * 60)
    : 1 - seconds / (BREAK_MIN * 60)

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">{phase === 'work' ? '🍅 Foco' : '☕ Descanso'}</p>
          <p className="text-xs text-gray-500 truncate max-w-[180px]">{taskTitle}</p>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-300 transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${phase === 'work' ? 'bg-orange-500' : 'bg-emerald-500'}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-3xl font-mono font-bold text-gray-100">{mm}:{ss}</span>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-100 transition-colors"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              running
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-orange-600 hover:bg-orange-500 text-white'
            }`}
          >
            {running ? <Pause size={15} /> : <Play size={15} />}
          </button>
        </div>
      </div>
    </div>
  )
}
