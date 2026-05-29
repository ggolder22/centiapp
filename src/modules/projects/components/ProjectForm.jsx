import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { useProjectStore } from '../../../store/projectStore'

const empty = { name: '', description: '', budget: '' }

export default function ProjectForm() {
  const addProject = useProjectStore((s) => s.addProject)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return }
    setLoading(true)
    const { error } = await addProject({
      name: form.name.trim(),
      description: form.description.trim() || null,
      budget: form.budget ? Number(form.budget) : null,
    })
    if (error) setError(error.message)
    else { setForm(empty); setError('') }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-5 space-y-4">
      <h2 className="text-base font-semibold text-gray-100">Nuevo proyecto</h2>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Nombre *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Nombre del proyecto"
          className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Descripción</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Opcional"
          rows={3}
          className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Presupuesto estimado</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.budget}
          onChange={(e) => set('budget', e.target.value)}
          placeholder="0.00 (opcional)"
          className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && <p className="text-rose-400 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        <PlusCircle size={16} />
        {loading ? 'Guardando...' : 'Crear proyecto'}
      </button>
    </form>
  )
}
