import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useState } from "react";
import { ConfirmToken } from "@/types/index";

export default function NewPasswordView() {
    const [token, setToken] = useState<ConfirmToken["token"]>("");
    const [isValidToken, setIsValidToken] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center h-full px-4">
            <h1 className="text-3xl sm:text-4xl font-black text-white text-center">
                Restablecer contraseña
            </h1>
            <p className="text-base sm:text-lg font-light text-white mt-3 text-center">
                Ingresa el código que recibiste{" "}
                <span className="text-fuchsia-500 font-bold">por email</span>
            </p>

            <div className="w-full max-w-xs sm:max-w-sm mt-6">
                {!isValidToken ? (
                    <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} />
                ) : (
                    <NewPasswordForm token={token} />
                )}
            </div>
        </div>
    );
}
