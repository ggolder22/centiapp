import { useEffect } from 'react'
import { useProjectStore } from '../../store/projectStore'
import ProjectForm from './components/ProjectForm'
import ProjectCard from './components/ProjectCard'

export default function ProjectsPage() {
  const { projects, loading, fetchProjects } = useProjectStore()

  useEffect(() => { fetchProjects() }, [fetchProjects])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Proyectos</h1>
        <p className="text-sm text-gray-400 mt-1">Gestioná tus proyectos y sus gastos asociados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        <ProjectForm />

        <div>
          {loading && <p className="text-gray-500 text-sm">Cargando...</p>}
          {!loading && projects.length === 0 && (
            <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-500 text-sm">
              Sin proyectos. ¡Creá el primero!
            </div>
          )}
          <div className="grid gap-4">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
