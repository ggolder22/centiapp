import { create } from 'zustand'
import { supabase } from '../core/supabase'

const getQuadrant = (urgent, important) => {
  if (urgent && important)   return 'q1'  // Hacer hoy
  if (!urgent && important)  return 'q2'  // Planificar
  if (urgent && !important)  return 'q3'  // Delegar
  return 'q4'                             // Eliminar
}

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .neq('status', 'done')
      .order('created_at', { ascending: false })
    if (!error) set({ tasks: data })
    set({ loading: false })
  },

  addTask: async (title) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, user_id: user.id })
      .select()
      .single()
    if (!error) set((s) => ({ tasks: [data, ...s.tasks] }))
    return data
  },

  classifyTask: async (id, urgent, important) => {
    const quadrant = getQuadrant(urgent, important)
    const { data, error } = await supabase
      .from('tasks')
      .update({ urgent, important, quadrant })
      .eq('id', id)
      .select()
      .single()
    if (!error)
      set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? data : t)) }))
  },

  updateStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (!error)
      set((s) => ({
        tasks: status === 'done'
          ? s.tasks.filter((t) => t.id !== id)
          : s.tasks.map((t) => (t.id === id ? data : t)),
      }))
  },

  incrementPomodoro: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    const pomodoros = (task.pomodoros || 0) + 1
    const { data, error } = await supabase
      .from('tasks')
      .update({ pomodoros })
      .eq('id', id)
      .select()
      .single()
    if (!error)
      set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? data : t)) }))
  },

  deleteTask: async (id) => {
    await supabase.from('tasks').delete().eq('id', id)
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
  },

  getMITs: () => {
    const { tasks } = get()
    const q1 = tasks.filter((t) => t.quadrant === 'q1')
    const q2 = tasks.filter((t) => t.quadrant === 'q2')
    return [...q1, ...q2].slice(0, 3)
  },
}))
