import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { useFinanceStore, CATEGORIES } from '../../../store/financeStore'

const today = () => new Date().toISOString().slice(0, 10)

const empty = { type: 'expense', amount: '', category: '', description: '', date: today() }

export default function TransactionForm() {
  const addTransaction = useFinanceStore((s) => s.addTransaction)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleTypeChange = (type) => {
    setForm((f) => ({ ...f, type, category: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Ingresá un monto válido')
      return
    }
    if (!form.category) {
      setError('Seleccioná una categoría')
      return
    }
    addTransaction({ ...form, amount: Number(form.amount) })
    setForm({ ...empty, type: form.type })
    setError('')
  }

  const categories = CATEGORIES[form.type]

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
                ? t === 'income'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
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
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => set('amount', e.target.value)}
          className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Categoría</label>
        <select
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Seleccionar...</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Descripción</label>
        <input
          type="text"
          placeholder="Opcional"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Fecha */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Fecha</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
          className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && <p className="text-rose-400 text-xs">{error}</p>}

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        <PlusCircle size={16} />
        Agregar
      </button>
    </form>
  )
}
