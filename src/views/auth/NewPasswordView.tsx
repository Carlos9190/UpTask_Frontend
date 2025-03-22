import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useState } from "react";
import { ConfirmToken } from "@/types/index";

export default function NewPasswordView() {
    const [token, setToken] = useState<ConfirmToken["token"]>("");
    const [isValidToken, setIsValidToken] = useState(false);

    return (
        <div className="flex flex-col h-full w-full justify-center items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
                Restablecer contraseña
            </h1>
            <p className="text-sm sm:text-base text-white mt-2 text-center">
                Ingresa el código que recibiste{" "}
                <span className="text-fuchsia-500 font-semibold">por email</span>
            </p>


            {!isValidToken ? (
                <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} />
            ) : (
                <NewPasswordForm token={token} />
            )}

        </div>
    );
}
