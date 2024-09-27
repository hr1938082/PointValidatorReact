import Validator, { Error, Options } from "point-validator"
import { useState } from "react"

type StateKey<T> = Extract<keyof T, string>

export type AnyError<T> = Error<T> & {
    [k: string]: any
}

const useValidator = <T extends Record<string, any>>(option: Options<T>) => {
    const [Errors, setErrors] = useState<AnyError<T>>({})

    const handleErrors = (key: StateKey<T> | T & Record<string, any>, value?: string) => {
        setErrors(
            errors => (
                value !== undefined
                    ? { ...errors, [key as StateKey<T>]: value }
                    : typeof key === 'object' ? key : errors
            )
        )
    }

    const clearError = (...fields: StateKey<T>[]) => {
        setErrors((errors: any) => (
            Object.keys(errors).reduce(
                (carry, key) => ({
                    ...carry,
                    ...(fields.length > 0 && !fields.some(field => field === key) ? { [key]: errors[key] } : {}),
                }),
                {}
            )
        ))
    }

    const validate = (...fields: Extract<keyof T, string>[]) => {
        const validator = Validator(option)
        const { isValidated, errors } = validator.validate(...fields)
        setErrors(errors);
        return isValidated;
    }

    return {
        Errors,
        validate,
        setErrors: handleErrors,
        clearError
    }
}

export default useValidator