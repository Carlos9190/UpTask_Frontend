import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { RequestConfirmationCodeForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { requestConfirmationCode } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function RequestConfirmationCodeView() {
    const initialValues: RequestConfirmationCodeForm = {
        email: "",
    };

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: requestConfirmationCode,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
        },
    });

    const handleRequestCode = (formData: RequestConfirmationCodeForm) => mutate(formData);

    return (
        <div className="flex flex-col items-center justify-center h-full px-4">
            <h1 className="text-3xl sm:text-4xl font-black text-white text-center">
                Solicitar código de confirmación
            </h1>
            <p className="text-base sm:text-lg font-light text-white mt-3 text-center">
                Ingresa tu email para recibir{" "}
                <span className="text-fuchsia-500 font-bold">un nuevo código</span>
            </p>

            <form
                onSubmit={handleSubmit(handleRequestCode)}
                className="space-y-4 p-5 sm:p-8 rounded-xl bg-white mt-6 w-full max-w-xs sm:max-w-sm"
                noValidate
            >
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-lg sm:text-xl" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de registro"
                        className="w-full p-3 rounded-lg border border-gray-300"
                        {...register("email", {
                            required: "El Email de registro es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    value="Enviar código"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 rounded-lg text-white font-bold text-lg cursor-pointer"
                />
            </form>

            <nav className="mt-4 flex flex-col space-y-2 text-center w-full">
                <Link to="/auth/login" className="text-gray-300 text-sm sm:text-base hover:text-fuchsia-500">
                    ¿Ya tienes cuenta? Iniciar sesión
                </Link>
                <Link to="/auth/forgot-password" className="text-gray-300 text-sm sm:text-base hover:text-fuchsia-500">
                    ¿Olvidaste tu contraseña? Reestablecer
                </Link>
            </nav>
        </div>
    );
}