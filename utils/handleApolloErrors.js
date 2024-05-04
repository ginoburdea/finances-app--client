import { ApolloError } from '@apollo/client'
import { UNKNOWN_ERROR } from './errors.js'

/** @typedef {import('react').Dispatch<React.SetStateAction<string>>} ReactSetter */

/**
 * @param {Error | ApolloError} error
 * @param {{ [key:string]: ReactSetter, other: ReactSetter }} errorSetters
 * @returns
 */
export const handleApolloErrors = (error, errorSetters) => {
    for (const key in errorSetters) {
        errorSetters[key](null)
    }

    if (!error) return
    console.log(error)
    
    if (!(error instanceof ApolloError)) {
        errorSetters.other(UNKNOWN_ERROR)
        return
    }

    const validationPath = error?.graphQLErrors?.at(0)?.path?.at(0)
    if (Object.keys(errorSetters).includes(validationPath)) {
        errorSetters[validationPath](error.graphQLErrors[0].message)
        return
    }
    errorSetters.other(UNKNOWN_ERROR)
}
