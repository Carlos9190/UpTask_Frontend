import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjects } from "@/api/ProjectAPI"
import { useAuth } from '@/hooks/useAuth'
import { isManager } from '@/utils/policies'
import DeleteProjectModal from '@/components/projects/DeleteProjectModal'

export default function DashboardView() {
    const location = useLocation()
    const navigate = useNavigate()
    const { data: user, isLoading: authLoading } = useAuth()
    const { data, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects
    })

    if (isLoading || authLoading) return 'Cargando...'
    if (data && user) return (
        <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center md:text-left">Mis proyectos</h1>
            <p className="text-base sm:text-lg md:text-2xl font-light text-gray-500 mt-5 text-center md:text-left">
                Maneja y administra tus proyectos
            </p>

            <nav className="my-5 text-center md:text-left">
                <Link
                    className="bg-purple-400 hover:bg-purple-500 px-6 sm:px-10 py-3 text-white text-lg sm:text-xl font-bold rounded-lg transition-colors inline-block"
                    to='/projects/create'
                >
                    Nuevo Proyecto
                </Link>
            </nav>

            {data?.length ? (
                <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg rounded-lg">
                    {data.map((project) => (
                        <li key={project._id} className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-x-6 px-5 py-6">
                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <div>
                                    {isManager(project.manager, user._id) ? (
                                        <p className="font-bold text-xs uppercase bg-indigo-50 text-indigo-500 border-2 border-indigo-500 rounded-lg inline-block py-1 px-5">
                                            Manager
                                        </p>
                                    ) : (
                                        <p className="font-bold text-xs uppercase bg-green-50 text-green-500 border-2 border-green-500 rounded-lg inline-block py-1 px-5">
                                            Colaborador
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 w-full">
                                    <Link
                                        to={`/projects/${project._id}`}
                                        className="text-gray-600 cursor-pointer hover:underline text-lg sm:text-xl md:text-3xl font-bold block"
                                    >
                                        {project.projectName}
                                    </Link>
                                    <p className="text-sm text-gray-400">Cliente: {project.clientName}</p>
                                    <p className="text-sm text-gray-400">{project.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end sm:justify-start">
                                <Menu as="div" className="relative">
                                    <Menu.Button className="-m-2.5 p-2.5 text-gray-500 hover:text-gray-900" aria-label="Opciones de proyecto">
                                        <EllipsisVerticalIcon className="h-8 w-8" aria-hidden="true" />
                                    </Menu.Button>
                                    <Transition as={Fragment}
                                        enter="transition ease-out duration-150"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 sm:w-56 mt-2 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                            <Menu.Item>
                                                <Link to={`/projects/${project._id}`}
                                                    className="block px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
                                                >
                                                    Ver Proyecto
                                                </Link>
                                            </Menu.Item>
                                            {isManager(project.manager, user._id) && (
                                                <>
                                                    <Menu.Item>
                                                        <Link to={`/projects/${project._id}/edit`}
                                                            className="block px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
                                                        >
                                                            Editar Proyecto
                                                        </Link>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <button
                                                            type="button"
                                                            className="block px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
                                                            onClick={() => navigate(location.pathname + `?deleteProject=${project._id}`)}
                                                        >
                                                            Eliminar Proyecto
                                                        </button>
                                                    </Menu.Item>
                                                </>
                                            )}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center py-10">
                    No hay proyectos aún {' '}
                    <Link className="text-fuchsia-500 font-bold" to='/projects/create'>
                        Crear proyecto
                    </Link>
                </p>
            )}

            <DeleteProjectModal />
        </>
    )
}