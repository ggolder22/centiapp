import { create } from 'zustand'
import { supabase } from '../core/supabase'

export const useProjectStore = create((set, get) => ({
  projects: [],
  loading: false,

  fetchProjects: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) set({ projects: data })
    set({ loading: false })
  },

  addProject: async (project) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...project, user_id: user.id })
      .select()
      .single()
    if (!error) set((s) => ({ projects: [data, ...s.projects] }))
    return { data, error }
  },

  updateProject: async (id, updates) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error)
      set((s) => ({ projects: s.projects.map((p) => (p.id === id ? data : p)) }))
    return { data, error }
  },

  deleteProject: async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }))
  },

  getProjectExpenses: async (projectId) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('project_id', projectId)
      .eq('type', 'expense')
      .order('date', { ascending: false })
    return error ? [] : data
  },
}))
