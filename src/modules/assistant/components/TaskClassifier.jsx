import { useState } from 'react'
import { useTaskStore } from '../../../store/taskStore'

const steps = [
  {
    key: 'urgent',
    question: '¿Tiene consecuencias reales si no lo hacés HOY?',
    yes: '⚡ Sí, es para hoy',
    no: '📅 No, puede esperar',
  },
  {
    key: 'important',
    question: '¿Está alineado con tus metas o responsabilidades clave?',
    yes: '🎯 Sí, es importante',
    no: '🌀 No realmente',
  },
]

const quadrantInfo = {
  q1: { label: '🔴 Hacer hoy', desc: 'Urgente e importante. Foco total.', color: 'border-rose-500 bg-rose-950' },
  q2: { label: '🟡 Planificar', desc: 'Importante pero no urgente. Agendalo.', color: 'border-yellow-500 bg-yellow-950' },
  q3: { label: '🟠 Reducir', desc: 'Urgente pero no importante. ¿Podés delegarlo o simplificarlo?', color: 'border-orange-500 bg-orange-950' },
  q4: { label: '⚪ Eliminar', desc: 'Ni urgente ni importante. Borralo de tu cabeza.', color: 'border-gray-600 bg-gray-800' },
}

const getQuadrant = (urgent, important) => {
  if (urgent && important)  return 'q1'
  if (!urgent && important) return 'q2'
  if (urgent && !important) return 'q3'
  return 'q4'
}

export default function TaskClassifier({ task, onDone }) {
  const classifyTask = useTaskStore((s) => s.classifyTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleAnswer = async (value) => {
    const newAnswers = { ...answers, [steps[step].key]: value }
    setAnswers(newAnswers)

    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      const quadrant = getQuadrant(newAnswers.urgent, newAnswers.important)
      setResult(quadrant)
      setSaving(true)
      await classifyTask(task.id, newAnswers.urgent, newAnswers.important)
      setSaving(false)
    }
  }

  const handleEliminate = async () => {
    await deleteTask(task.id)
    onDone()
  }

  if (result) {
    const info = quadrantInfo[result]
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
        <div className={`w-full max-w-sm bg-gray-900 rounded-2xl p-6 border ${info.color} space-y-4`}>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-100">{info.label}</p>
            <p className="text-sm text-gray-400 mt-2">{info.desc}</p>
            <p className="text-base text-gray-200 mt-3 font-medium">"{task.title}"</p>
          </div>
          <div className="flex gap-2 pt-2">
            {result === 'q4' && (
              <button onClick={handleEliminate} className="flex-1 py-2.5 rounded-lg bg-gray-700 hover:bg-rose-900 text-gray-300 hover:text-rose-300 text-sm font-medium transition-colors">
                Eliminar tarea
              </button>
            )}
            <button onClick={onDone} className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
              {result === 'q4' ? 'Igual guardarla' : 'Entendido'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const current = steps[step]

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-6 space-y-5">
        <div>
          <div className="flex gap-1 mb-4">
            {steps.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? 'bg-indigo-500' : 'bg-gray-700'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mb-1">Tarea: <span className="text-gray-200">{task.title}</span></p>
          <p className="text-lg font-semibold text-gray-100 mt-3">{current.question}</p>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => handleAnswer(true)} className="w-full py-3 rounded-xl bg-gray-800 hover:bg-indigo-700 text-gray-100 text-sm font-medium transition-colors text-left px-4">
            {current.yes}
          </button>
          <button onClick={() => handleAnswer(false)} className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm font-medium transition-colors text-left px-4">
            {current.no}
          </button>
        </div>
      </div>
    </div>
  )
}
