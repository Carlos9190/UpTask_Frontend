import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { UserLoginForm } from "@/types/index"
import ErrorMessage from "@/components/ErrorMessage"
import { authenticateUser } from "@/api/AuthAPI"
import { toast } from "react-toastify"

export default function LoginView() {
    const { register, handleSubmit, formState: { errors } } = useForm<UserLoginForm>({
        defaultValues: { email: "", password: "" }
    })

    const navigate = useNavigate()
    const { mutate } = useMutation({
        mutationFn: authenticateUser,
        onError: (error) => toast.error(error.message),
        onSuccess: () => navigate("/")
    })

    const handleLogin = (formData: UserLoginForm) => mutate(formData)

    return (
        <div className="flex flex-col flex-grow justify-center items-center w-full h-full px-4">
            <h1 className="text-3xl sm:text-4xl font-black text-white text-center">Iniciar sesión</h1>
            <p className="text-base sm:text-lg font-light text-white mt-3 text-center">
                Comienza a planear tus proyectos <span className="text-fuchsia-500 font-bold">iniciando sesión</span>
            </p>

            <form onSubmit={handleSubmit(handleLogin)} className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 mt-6" noValidate>
                <div className="flex flex-col gap-3">
                    <label className="font-normal text-lg">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de registro"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        {...register("email", {
                            required: "El Email es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Email no válido",
                            },
                        })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-3 mt-4">
                    <label className="font-normal text-lg">Password</label>
                    <input
                        type="password"
                        placeholder="Password de registro"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        {...register("password", { required: "El Password es obligatorio" })}
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <input type="submit" value="Iniciar sesión" className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-lg cursor-pointer rounded-lg mt-4" />
            </form>

            <nav className="mt-6 flex flex-col space-y-2 w-full max-w-md">
                <Link to="/auth/register" className="text-center text-gray-300 text-sm hover:text-fuchsia-500">No tienes cuenta? Crea una</Link>
                <Link to="/auth/forgot-password" className="text-center text-gray-300 text-sm hover:text-fuchsia-500">Olvidaste tu password? Reestablecer</Link>
            </nav>
        </div>
    )
}