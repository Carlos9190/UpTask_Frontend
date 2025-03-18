import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslations } from "@/locales/es"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { updateStatus } from '@/api/TaskAPI'
import { useParams } from 'react-router-dom'

type TaskListProps = {
    tasks: TaskProject[]
    canEdit: boolean
}

type GroupTasks = {
    [key: string]: TaskProject[]
}

const initialStatusGroups: GroupTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: []
}

const statusStyles: { [key: string]: string } = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgress: 'border-t-blue-500',
    underReview: 'border-t-amber-500',
    completed: 'border-t-emerald-500'
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {

    const params = useParams()
    const projectId = params.projectId!
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        }
    })

    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : []
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup }
    }, initialStatusGroups)

    const handleDragEnd = (e: DragEndEvent) => {
        const { over, active } = e

        if (over && over.id) {
            const taskId = active.id.toString()
            const status = over.id as TaskStatus
            mutate({ projectId, taskId, status })

            queryClient.setQueryData(['project', projectId], (oldData: Project) => {
                const updatedTasks = oldData.tasks.map((task) =>
                    task._id === taskId ? { ...task, status } : task
                )

                return { ...oldData, tasks: updatedTasks }
            })
        }
    }

    return (
        <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black my-10 text-center">
                Tareas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 pb-32">
                <DndContext onDragEnd={handleDragEnd}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className="min-h-[150px] bg-white rounded-lg shadow-md p-4">
                            <h3 className={`capitalize text-lg font-semibold p-3 border-t-8 ${statusStyles[status]}`}>
                                {statusTranslations[status]}
                            </h3>

                            <DropTask status={status} />

                            <ul className="mt-5 space-y-5">
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>
        </>
    )
}
