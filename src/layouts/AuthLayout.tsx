import Logo from "@/components/Logo"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"

export default function AuthLayout() {
    return (
        <>
            <div className="bg-gray-800 min-h-screen flex items-center justify-center px-4">
                <div className="py-10 w-full max-w-lg flex flex-col items-center">
                    <Logo />
                    <div className="mt-10 w-full">
                        <Outlet />
                    </div>
                </div>
            </div>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    )
}