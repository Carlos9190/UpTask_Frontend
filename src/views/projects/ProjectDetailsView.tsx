import { useMemo } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getFullProject } from "@/api/ProjectAPI"
import AddTaskModal from "@/components/tasks/AddTaskModal"
import TaskList from "@/components/tasks/TaskList"
import EditTaskData from "@/components/tasks/EditTaskData"
import TaskModalDetails from "@/components/tasks/TaskModalDetails"
import { useAuth } from "@/hooks/useAuth"
import { isManager } from "@/utils/policies"

export default function ProjectDetailsView() {
    const { data: user, isLoading: authLoading } = useAuth()
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getFullProject(projectId),
        retry: false
    })

    const canEdit = useMemo(() => data?.manager === user?._id, [data, user])
    if (isLoading && authLoading) return 'Cargando'
    if (isError) return <Navigate to='/404' />

    if (data && user) return (
        <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center sm:text-left">
                {data.projectName}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-gray-500 mt-5 text-center sm:text-left">
                {data.description}
            </p>

            {isManager(data.manager, user._id) ? (
                <nav className="my-5 flex flex-col sm:flex-row gap-3 items-center sm:items-start">
                    <button
                        type="button"
                        className="bg-purple-500 hover:bg-purple-600 px-6 sm:px-10 py-2 sm:py-3 
               text-white text-lg sm:text-xl font-bold cursor-pointer transition-colors 
               w-full sm:w-auto text-center flex items-center justify-center"
                        onClick={() => navigate(location.pathname + '?newTask=true')}
                    >
                        Agregar tarea
                    </button>

                    <Link
                        to={'team'}
                        className="bg-fuchsia-500 hover:bg-fuchsia-600 px-6 sm:px-10 py-2 sm:py-3 
               text-white text-lg sm:text-xl font-bold cursor-pointer transition-colors 
               w-full sm:w-auto text-center flex items-center justify-center"
                    >
                        Colaboradores
                    </Link>

                    <Link
                        to={'/'}
                        className="bg-violet-500 hover:bg-violet-600 px-6 sm:px-10 py-2 sm:py-3 
               text-white text-lg sm:text-xl font-bold cursor-pointer transition-colors 
               w-full sm:w-auto text-center flex items-center justify-center"
                    >
                        Volver a proyectos
                    </Link>
                </nav>
            ) : (
                <nav className="my-5 flex justify-center sm:justify-start">
                    <Link
                        to={'/'}
                        className="bg-violet-500 hover:bg-violet-600 px-6 sm:px-10 py-2 sm:py-3 
                                   text-white text-lg sm:text-xl font-bold cursor-pointer transition-colors"
                    >
                        Volver a proyectos
                    </Link>
                </nav>
            )}

            <TaskList tasks={data.tasks} canEdit={canEdit} />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}
