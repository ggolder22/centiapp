import { create } from 'zustand'
import { supabase } from '../core/supabase'

const CATEGORIES_INCOME = ['Sueldo', 'Docencia', 'Marketing', 'Programación', 'Automatización', 'Freelance', 'Inversión', 'Otro ingreso']
const CATEGORIES_EXPENSE = ['Vivienda', 'Comida', 'Transporte', 'Salud', 'Educación', 'Entretenimiento', 'Servicios', 'Otro gasto']

export const CATEGORIES = { income: CATEGORIES_INCOME, expense: CATEGORIES_EXPENSE }

export const useFinanceStore = create((set, get) => ({
  transactions: [],
  loading: false,

  fetchTransactions: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
    if (!error) set({ transactions: data })
    set({ loading: false })
  },

  addTransaction: async (tx) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...tx, user_id: user.id })
      .select()
      .single()
    if (!error) set((s) => ({ transactions: [data, ...s.transactions] }))
  },

  deleteTransaction: async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }))
  },

  getTotals: () => {
    const { transactions } = get()
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
    return { income, expense, balance: income - expense }
  },

  getMonthlyData: () => {
    const { transactions } = get()
    const map = {}
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7)
      if (!map[month]) map[month] = { month, income: 0, expense: 0 }
      map[month][t.type] += Number(t.amount)
    })
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month))
  },
}))
