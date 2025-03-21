import type { ConfirmToken, NewPasswordForm } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordWithToken } from "@/api/AuthAPI";
import { toast } from "react-toastify";

type NewPasswordFormProps = {
    token: ConfirmToken["token"];
};

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
    const navigate = useNavigate();
    const initialValues: NewPasswordForm = {
        password: "",
        password_confirmation: "",
    };
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: updatePasswordWithToken,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            reset();
            navigate("/auth/login");
        },
    });

    const handleNewPassword = (formData: NewPasswordForm) => {
        const data = {
            formData,
            token,
        };
        mutate(data);
    };

    const password = watch("password");

    return (
        <form
            onSubmit={handleSubmit(handleNewPassword)}
            className="w-full max-w-md bg-white mt-10 p-6 sm:p-10 rounded-lg shadow-md space-y-6"
            noValidate
        >
            <div className="flex flex-col gap-3">
                <label className="font-normal text-lg sm:text-2xl">Password</label>
                <input
                    type="password"
                    placeholder="Password nuevo"
                    className="w-full p-3 border-gray-300 border rounded-lg"
                    {...register("password", {
                        required: "El Password es obligatorio",
                        minLength: {
                            value: 8,
                            message: "El Password debe ser mínimo de 8 caracteres",
                        },
                    })}
                />
                {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </div>

            <div className="flex flex-col gap-3">
                <label className="font-normal text-lg sm:text-2xl">Repetir password</label>
                <input
                    id="password_confirmation"
                    type="password"
                    placeholder="Repite el password nuevo"
                    className="w-full p-3 border-gray-300 border rounded-lg"
                    {...register("password_confirmation", {
                        required: "Repetir Password es obligatorio",
                        validate: (value) => value === password || "Los Passwords no son iguales",
                    })}
                />
                {errors.password_confirmation && (
                    <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                )}
            </div>

            <input
                type="submit"
                value="Restablecer password"
                className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-lg sm:text-xl cursor-pointer rounded-lg"
            />
        </form>
    );
}