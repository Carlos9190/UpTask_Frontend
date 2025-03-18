import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { forgotPassword } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {
    const initialValues: ForgotPasswordForm = { email: "" };
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: forgotPassword,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data);
            reset();
        }
    });

    const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData);

    return (
        <div className="flex flex-col items-center justify-center w-full px-4 sm:px-8 lg:px-0">
            <h1 className="text-2xl sm:text-4xl font-black text-white text-center">Reestablecer contraseña</h1>
            <p className="text-sm sm:text-lg font-light text-white mt-3 text-center px-2">
                Ingresa tu correo electrónico para recibir instrucciones de recuperación.
            </p>

            <form
                onSubmit={handleSubmit(handleForgotPassword)}
                className="w-full max-w-xs sm:max-w-md bg-white shadow-lg rounded-xl p-5 sm:p-8 mt-6"
                noValidate
            >
                <div className="flex flex-col gap-3">
                    <label className="font-normal text-base sm:text-lg" htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Tu correo electrónico"
                        className="w-full p-3 border-gray-300 border rounded-lg"
                        {...register("email", {
                            required: "El correo es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Correo no válido",
                            },
                        })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    value="Enviar instrucciones"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-bold text-lg cursor-pointer rounded-lg mt-4"
                />
            </form>

            <nav className="mt-6 flex flex-col space-y-3 w-full max-w-xs sm:max-w-md">
                <Link to='/auth/login' className="text-center text-gray-300 text-sm sm:text-base hover:text-fuchsia-500">¿Ya tienes cuenta? Iniciar Sesión</Link>
                <Link to='/auth/register' className="text-center text-gray-300 text-sm sm:text-base hover:text-fuchsia-500">¿No tienes cuenta? Regístrate</Link>
            </nav>
        </div>
    );
}