import { useEffect } from 'react'
import { useFinanceStore } from '../../store/financeStore'
import SummaryCards from './components/SummaryCards'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'

export default function FinancesPage() {
  const fetchTransactions = useFinanceStore((s) => s.fetchTransactions)

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Finanzas</h1>
        <p className="text-sm text-gray-400 mt-1">Registrá tus ingresos y gastos</p>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        <TransactionForm />
        <TransactionList />
      </div>
    </div>
  )
}
