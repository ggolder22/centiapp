import { useState, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'
import { useFinanceStore, CATEGORIES } from '../../../store/financeStore'
import { useProjectStore } from '../../../store/projectStore'

const today = () => new Date().toISOString().slice(0, 10)

const empty = { type: 'expense', amount: '', category: '', description: '', date: today(), project_id: '' }

export default function TransactionForm() {
  const addTransaction = useFinanceStore((s) => s.addTransaction)
  const { projects, fetchProjects } = useProjectStore()
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleTypeChange = (type) => {
    setForm((f) => ({ ...f, type, category: '', project_id: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) { setError('Ingresá un monto válido'); return }
    if (!form.category) { setError('Seleccioná una categoría'); return }
    setLoading(true)
    await addTransaction({
      ...form,
      amount: Number(form.amount),
      project_id: form.project_id || null,
    })
    setForm({ ...empty, type: form.type })
    setError('')
    setLoading(false)
  }

  const categories = CATEGORIES[form.type]
  const activeProjects = projects.filter((p) => p.status === 'activo')

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-5 space-y-4">
      <h2 className="text-base font-semibold text-gray-100">Nueva transacción</h2>

      {/* Tipo */}
      <div className="flex gap-2">
        {['income', 'expense'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTypeChange(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              form.type === t
                ? t === 'income' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {t === 'income' ? 'Ingreso' : 'Gasto'}
          </button>
        ))}
      </div>

      {/* Monto */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Monto</label>
        <input
          type="number" min="0" step="0.01" placeholder="0.00"
          value={form.amount} onChange={(e) => set('amount', e.target.value)}
          className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Categoría</label>
        <select
          value={form.category} onChange={(e) => set('category', e.target.value)}
          className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Seleccionar...</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Proyecto (solo en gastos) */}
      {form.type === 'expense' && activeProjects.length > 0 && (
        <div>
          <label className="block text-xs text-gray-400 mb-1">Proyecto <span className="text-gray-600">(opcional)</span></label>
          <select
            value={form.project_id} onChange={(e) => set('project_id', e.target.value)}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Sin proyecto</option>
            {activeProjects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      )}

      {/* Descripción */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Descripción</label>
        <input
          type="text" placeholder="Opcional"
          value={form.description} onChange={(e) => set('description', e.target.value)}
          className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Fecha */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Fecha</label>
        <input
          type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
          className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && <p className="text-rose-400 text-xs">{error}</p>}

      <button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        <PlusCircle size={16} />
        {loading ? 'Guardando...' : 'Agregar'}
      </button>
    </form>
  )
}
