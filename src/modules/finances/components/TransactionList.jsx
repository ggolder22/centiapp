import { Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { useFinanceStore } from '../../../store/financeStore'

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)

export default function TransactionList() {
  const transactions = useFinanceStore((s) => s.transactions)
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction)

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-500 text-sm">
        Sin transacciones. ¡Agregá la primera!
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700">
        <h2 className="text-base font-semibold text-gray-100">Últimas transacciones</h2>
      </div>
      <ul className="divide-y divide-gray-700">
        {transactions.map((t) => (
          <li key={t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-750 transition-colors">
            <div className={`p-1.5 rounded-lg ${t.type === 'income' ? 'bg-emerald-900' : 'bg-rose-900'}`}>
              {t.type === 'income'
                ? <TrendingUp size={14} className="text-emerald-400" />
                : <TrendingDown size={14} className="text-rose-400" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-100 truncate">{t.description || t.category}</p>
              <p className="text-xs text-gray-500">{t.category} · {t.date}</p>
            </div>
            <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
            </span>
            <button
              onClick={() => deleteTransaction(t.id)}
              className="text-gray-600 hover:text-rose-400 transition-colors ml-1"
              title="Eliminar"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
