import { Fragment } from "react/jsx-runtime"
import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { getProjectTeam, removeUserFromProject } from "@/api/TeamAPI"
import AddMemberModal from "@/components/team/AddMemberModal"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Spinner from "@/components/Spinner"

export default function ProjectTeamView() {
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['projectTeam', projectId],
        queryFn: () => getProjectTeam(projectId),
        retry: false
    })

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: removeUserFromProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['projectTeam', projectId] })
        }
    })

    if (isLoading) return <Spinner />
    if (isError) return <Navigate to={'/404'} />
    if (data) return (
        <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center sm:text-left">
                Administrar equipo
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-gray-500 mt-3 text-center sm:text-left">
                Administra el equipo de trabajo del proyecto
            </p>

            <nav className="my-5 flex flex-col sm:flex-row gap-3 items-center sm:items-start">
                <button
                    type="button"
                    className="bg-purple-400 hover:bg-purple-500 px-6 sm:px-10 py-2 sm:py-3 
                               text-white text-lg sm:text-xl font-bold cursor-pointer transition-colors 
                               w-full sm:w-auto text-center flex items-center justify-center"
                    onClick={() => navigate(location.pathname + '?addMember=true')}
                >
                    Agregar colaborador
                </button>

                <Link
                    to={`/projects/${projectId}`}
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 px-6 sm:px-10 py-2 sm:py-3 
                               text-white text-lg sm:text-xl font-bold cursor-pointer transition-colors 
                               w-full sm:w-auto text-center flex items-center justify-center"
                >
                    Volver a proyecto
                </Link>
            </nav>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black my-8 sm:my-10 text-center sm:text-left">
                Miembros actuales
            </h2>

            {data.length ? (
                <ul role="list" className="divide-y divide-gray-200 border border-gray-200 mt-6 bg-white shadow-lg rounded-lg">
                    {data?.map((member) => (
                        <li key={member._id} className="flex flex-col sm:flex-row justify-between gap-4 px-5 py-6 items-center">
                            <div className="flex items-center gap-4">
                                <div className="text-center sm:text-left">
                                    <p className="text-xl sm:text-2xl font-black text-gray-600">{member.name}</p>
                                    <p className="text-sm text-gray-400">{member.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Menu as="div" className="relative">
                                    <Menu.Button className="p-2 text-gray-500 hover:text-gray-900">
                                        <EllipsisVerticalIcon className="h-7 w-7 sm:h-9 sm:w-9" aria-hidden="true" />
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                            <Menu.Item>
                                                <button
                                                    type='button'
                                                    className='block w-full px-4 py-2 text-sm text-red-500 hover:bg-red-100 text-center'
                                                    onClick={() => mutate({ projectId, userId: member._id })}
                                                >
                                                    Eliminar del Proyecto
                                                </button>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className='text-center py-16 text-lg sm:text-xl text-gray-500'>No hay miembros en este equipo</p>
            )}

            <AddMemberModal />
        </>
    )
}
