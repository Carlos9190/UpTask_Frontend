import { Link, Navigate, Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Logo from "@/components/Logo"
import { NavMenu } from "@/components/NavMenu"
import { useAuth } from "@/hooks/useAuth"
import Spinner from "@/components/Spinner"

export default function AppLayout() {
    const { data, isError, isLoading } = useAuth()

    if (isLoading) return <Spinner />

    if (isError) {
        return <Navigate to='/auth/login' />
    }

    if (data) return (
        <>
            <header className="bg-gray-800 py-5 px-4">
                <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="w-48 sm:w-64">
                        <Link to={'/'}>
                            <Logo />
                        </Link>
                    </div>

                    <NavMenu name={data.name} />
                </div>
            </header>

            <section className="max-w-screen-2xl mx-auto mt-10 px-4 sm:px-5">
                <Outlet />
            </section>

            <footer className="py-5 px-4">
                <p className="text-center text-sm sm:text-base">
                    Todos los derechos reservados {new Date().getFullYear()}
                </p>
            </footer>

            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
        </>
    )
}
