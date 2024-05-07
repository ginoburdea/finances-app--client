import { Text, View } from 'react-native'
import { handleAuthData } from '../../utils/handleAuhData.js'
import { useEffect, useState } from 'react'
import { handleApolloErrors } from '../../utils/handleApolloErrors.js'
import { gql, useMutation } from '@apollo/client'
import { apolloClient } from '../../utils/apolloClient.js'
import { authStyles } from '../../utils/authStyles.js'
import { globalStyles } from '../../utils/globalStyles.js'
import FButton from '../../components/FButton.js'
import FInput from '../../components/FInput.js'
import { Link, useRouter } from 'expo-router'

const REGISTER_MUTATION = gql`
    mutation($name: String!, $username: String!, $password: String!) {
        register(
            registerInput: {
                name: $name
                username: $username
                password: $password
            }
        ) {
            session {
                token
                expiresAt
            }
            user {
                name
                username
            }
        }
    }
`

export default function Register() {
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState('')

    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [
        register,
        { loading, error: apolloError, data },
    ] = useMutation(REGISTER_MUTATION, { client: apolloClient })

    const [error, setError] = useState(null)

    const router = useRouter()

    useEffect(() => {
        handleApolloErrors(apolloError, {
            name: setNameError,
            username: setUsernameError,
            password: setPasswordError,
            other: setError,
        })
    }, [apolloError])

    useEffect(() => handleAuthData(data, router), [data])

    return (
        <>
            <View style={authStyles.marginBottom}>
                <Text
                    style={[
                        globalStyles.titleLarge,
                        authStyles.marginBottomSmall,
                    ]}
                >
                    Welcome!
                </Text>
                <Text style={globalStyles.text}>
                    Use the form below to register or{' '}
                    <Link href="/login" style={globalStyles.link}>
                        click here to log in
                    </Link>{' '}
                    if you have an account already
                </Text>
            </View>

            <View style={authStyles.marginBottom}>
                <FInput
                    label="Name"
                    value={name}
                    onChange={setName}
                    error={nameError}
                    onErrorChange={setNameError}
                    disabled={loading}
                />
                <FInput
                    label="Username"
                    value={username}
                    onChange={setUsername}
                    error={usernameError}
                    onErrorChange={setUsernameError}
                    disabled={loading}
                />
                <FInput
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    error={passwordError}
                    onErrorChange={setPasswordError}
                    hideInput={true}
                    disabled={loading}
                />
                <FButton
                    onPress={() =>
                        register({ variables: { name, username, password } })
                    }
                    title="Register"
                    loading={loading}
                    fullWidth
                />
            </View>

            {error && (
                <Text style={[globalStyles.error, authStyles.errorMessage]}>
                    {error}
                </Text>
            )}
        </>
    )
}
