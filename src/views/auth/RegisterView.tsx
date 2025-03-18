import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { createAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function RegisterView() {
    const initialValues: UserRegistrationForm = {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    };

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: createAccount,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data);
            reset();
        },
    });

    const password = watch("password");

    const handleRegister = (formData: UserRegistrationForm) => mutate(formData);

    return (
        <div className="flex flex-col h-full w-full justify-center items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">Crear Cuenta</h1>
            <p className="text-sm sm:text-base text-white mt-2 text-center">
                Llena el formulario para <span className="text-fuchsia-500 font-semibold">crear tu cuenta</span>
            </p>

            <form
                onSubmit={handleSubmit(handleRegister)}
                className="w-full max-w-xs sm:max-w-sm bg-white shadow-md rounded-lg p-5 mt-4 flex-grow"
                noValidate
            >
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        placeholder="Email de registro"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        {...register("email", {
                            required: "El email de registro es obligatorio",
                            pattern: { value: /\S+@\S+\.\S+/, message: "Email no válido" },
                        })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-2 mt-3">
                    <label className="text-sm font-medium">Nombre</label>
                    <input
                        type="text"
                        placeholder="Nombre de registro"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        {...register("name", { required: "El nombre de usuario es obligatorio" })}
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-2 mt-3">
                    <label className="text-sm font-medium">Password</label>
                    <input
                        type="password"
                        placeholder="Password de registro"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        {...register("password", {
                            required: "El Password es obligatorio",
                            minLength: { value: 8, message: "El password debe ser mínimo de 8 caracteres" },
                        })}
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-2 mt-3">
                    <label className="text-sm font-medium">Repetir password</label>
                    <input
                        type="password"
                        placeholder="Repite password de Registro"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        {...register("password_confirmation", {
                            required: "Repetir Password es obligatorio",
                            validate: (value) => value === password || "Los passwords no son iguales",
                        })}
                    />
                    {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    value="Registrarme"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-bold text-sm cursor-pointer rounded-md mt-4"
                />
            </form>

            <nav className="mt-4 flex flex-col space-y-2 w-full max-w-xs sm:max-w-sm">
                <Link to="/auth/login" className="text-center text-gray-300 text-sm hover:text-fuchsia-500">
                    ¿Ya tienes cuenta? Inicia sesión
                </Link>
                <Link to="/auth/forgot-password" className="text-center text-gray-300 text-sm hover:text-fuchsia-500">
                    ¿Olvidaste tu password? Reestablecer
                </Link>
            </nav>
        </div>
    );
}
