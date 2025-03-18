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
        <div className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md mt-10">
            <form className="space-y-8 p-6 sm:p-10 rounded-lg bg-white w-full">
                <label className="font-normal text-lg sm:text-2xl text-center block">
                    Código de 6 dígitos
                </label>
                <div className="flex justify-center gap-2 sm:gap-4">
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <PinInputField
                                key={index}
                                className="h-10 w-10 sm:h-12 sm:w-12 p-2 sm:p-3 rounded-lg border-gray-300 border placeholder-white text-center"
                            />
                        ))}
                    </PinInput>
                </div>
            </form>
            <nav className="mt-6 sm:mt-10 flex flex-col space-y-4">
                <Link to='/auth/forgot-password' className="text-center text-gray-300 font-normal hover:text-fuchsia-500">
                    Solicitar un nuevo código
                </Link>
            </nav>
        </div>
    )
}
