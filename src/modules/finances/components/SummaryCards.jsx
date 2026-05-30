import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { useFinanceStore } from '../../../store/financeStore'

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)

const Card = ({ label, value, icon: Icon, color }) => (
  <div className="bg-gray-800 rounded-xl p-5 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-xl font-bold text-gray-100 mt-0.5">{fmt(value)}</p>
    </div>
  </div>
)

export default function SummaryCards() {
  const getTotals = useFinanceStore((s) => s.getTotals)
  const { income, expense, balance } = getTotals()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card label="Ingresos" value={income} icon={TrendingUp} color="bg-emerald-600" />
      <Card label="Gastos" value={expense} icon={TrendingDown} color="bg-rose-600" />
      <Card
        label="Balance"
        value={balance}
        icon={Wallet}
        color={balance >= 0 ? 'bg-indigo-600' : 'bg-orange-600'}
      />
    </div>
  )
}
