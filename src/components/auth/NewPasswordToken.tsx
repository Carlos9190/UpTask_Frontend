import { Link } from 'react-router-dom'
import { PinInput, PinInputField } from '@chakra-ui/pin-input'
import { useMutation } from '@tanstack/react-query'
import { ConfirmToken } from '@/types/index'
import { validateToken } from '@/api/AuthAPI'
import { toast } from 'react-toastify'

type NewPasswordTokenProps = {
    token: ConfirmToken['token']
    setToken: React.Dispatch<React.SetStateAction<string>>
    setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NewPasswordToken({ token, setToken, setIsValidToken }: NewPasswordTokenProps) {
    const { mutate } = useMutation({
        mutationFn: validateToken,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            setIsValidToken(true)
        }
    })

    const handleChange = (token: ConfirmToken['token']) => {
        setToken(token)
    }

    const handleComplete = (token: ConfirmToken['token']) => mutate({ token })

    return (
        <>
            <form className="w-full max-w-xs sm:max-w-sm bg-white shadow-md rounded-lg p-5 mt-4 flex-grow">
                <label className="text-sm font-medium text-center block">
                    Código de 6 dígitos
                </label>
                <div className="flex justify-center gap-2 mt-3">
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        {[...Array(6)].map((_, index) => (
                            <PinInputField
                                key={index}
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
        </>
    )
}
