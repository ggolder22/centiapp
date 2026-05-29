import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const CATEGORIES_INCOME = ['Sueldo', 'Docencia', 'Marketing', 'Programación', 'Automatización', 'Freelance', 'Inversión', 'Otro ingreso']
const CATEGORIES_EXPENSE = ['Vivienda', 'Comida', 'Transporte', 'Salud', 'Educación', 'Entretenimiento', 'Servicios', 'Otro gasto']

export const CATEGORIES = { income: CATEGORIES_INCOME, expense: CATEGORIES_EXPENSE }

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (tx) =>
        set((s) => ({
          transactions: [
            { ...tx, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
            ...s.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      // Derived selectors
      getTotals: () => {
        const { transactions } = get()
        const income = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)
        const expense = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
        return { income, expense, balance: income - expense }
      },

      getMonthlyData: () => {
        const { transactions } = get()
        const map = {}
        transactions.forEach((t) => {
          const month = t.date.slice(0, 7) // "YYYY-MM"
          if (!map[month]) map[month] = { month, income: 0, expense: 0 }
          map[month][t.type] += t.amount
        })
        return Object.values(map).sort((a, b) => a.month.localeCompare(b.month))
      },
    }),
    { name: 'centiapp-finances' }
  )
)
