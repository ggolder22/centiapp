import { useEffect } from 'react'
import { useFinanceStore } from '../../store/financeStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import SummaryCards from './components/SummaryCards'

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

export default function Dashboard() {
  const fetchTransactions = useFinanceStore((s) => s.fetchTransactions)
  const getMonthlyData = useFinanceStore((s) => s.getMonthlyData)
  const transactions = useFinanceStore((s) => s.transactions)
  const data = getMonthlyData()

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Resumen general de tu situación financiera</p>
      </div>

      <SummaryCards />

      <div className="bg-gray-800 rounded-xl p-5">
        <h2 className="text-base font-semibold text-gray-100 mb-4">Ingresos vs Gastos por mes</h2>
        {data.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            Sin datos. Agregá transacciones en el módulo de Finanzas.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} barGap={4}>
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tickFormatter={(v) => fmt(v)} tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
              <Tooltip
                formatter={(value) => fmt(value)}
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
              <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl p-5">
        <h2 className="text-base font-semibold text-gray-100 mb-3">Últimas 5 transacciones</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">Sin transacciones registradas.</p>
        ) : (
          <ul className="space-y-2">
            {transactions.slice(0, 5).map((t) => (
              <li key={t.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-300">{t.description || t.category}</span>
                <span className={t.type === 'income' ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
