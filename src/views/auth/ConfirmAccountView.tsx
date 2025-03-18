import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import { ConfirmToken } from "@/types/index";
import { confirmAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ConfirmAccountView() {
    const [token, setToken] = useState<ConfirmToken["token"]>("");

    const navigate = useNavigate();
    const { mutate } = useMutation({
        mutationFn: confirmAccount,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data);
            navigate("/auth/login");
        },
    });

    const handleChange = (token: ConfirmToken["token"]) => setToken(token);
    const handleComplete = (token: ConfirmToken["token"]) => mutate({ token });

    return (
        <div className="flex flex-col h-full w-full justify-center items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
                Confirma tu cuenta
            </h1>
            <p className="text-sm sm:text-base text-white mt-2 text-center">
                Ingresa el código que recibiste {" "}
                <span className="text-fuchsia-500 font-semibold">por email</span>
            </p>

            <form className="w-full max-w-xs sm:max-w-sm bg-white shadow-md rounded-lg p-5 mt-4 flex-grow">
                <label className="text-sm font-medium text-center block">
                    Código de 6 dígitos
                </label>
                <div className="flex justify-center gap-2 mt-3">
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        {[...Array(6)].map((_, i) => (
                            <PinInputField
                                key={i}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-md border-gray-300 border placeholder-white text-center text-lg"
                            />
                        ))}
                    </PinInput>
                </div>
            </form>

            <nav className="mt-4">
                <Link
                    to="/auth/request-code"
                    className="text-center text-gray-300 text-sm hover:text-fuchsia-500 block"
                >
                    Solicitar un nuevo código
                </Link>
            </nav>
        </div>
    );
}
